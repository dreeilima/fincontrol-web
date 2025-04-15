"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { UserWithoutToken } from "@/types";
import { useSession } from "next-auth/react";

type UserContextType = {
  userData: UserWithoutToken | null;
  updateUserData: (newData: Partial<UserWithoutToken>) => void;
  refreshUserData: () => Promise<UserWithoutToken | null>;
  isRefreshing: boolean;
  lastUpdated: number; // Timestamp da última atualização
};

const UserContext = createContext<UserContextType>({
  userData: null,
  updateUserData: () => {},
  refreshUserData: async () => null,
  isRefreshing: false,
  lastUpdated: 0,
});

interface UserProviderProps {
  children: ReactNode;
  initialUserData?: UserWithoutToken | null;
}

export function UserProvider({
  children,
  initialUserData = null,
}: UserProviderProps) {
  const { data: session, update: updateSession } = useSession();
  const [userData, setUserData] = useState<UserWithoutToken | null>(
    initialUserData,
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(Date.now());

  // Debug
  console.log("Inicializando contexto com:", initialUserData);
  console.log("Sessão atual:", session?.user);

  // Função para atualizar o contexto e a sessão
  const updateUserData = useCallback(
    (newData: Partial<UserWithoutToken>) => {
      console.log("Atualizando contexto com:", newData);

      // Garantir que não vamos atualizar com dados nulos/undefined
      if (!newData || Object.keys(newData).length === 0) {
        console.log("Tentativa de atualização com dados vazios, ignorando");
        return;
      }

      setUserData((prev) => {
        if (!prev) return newData as UserWithoutToken;
        const updated = { ...prev, ...newData };
        return updated;
      });

      // Atualiza o timestamp
      setLastUpdated(Date.now());

      // Tenta atualizar a sessão também para manter consistência
      if (newData.name || newData.email) {
        updateSession({
          name: newData.name,
          email: newData.email,
        })
          .then(() => {
            console.log("Sessão atualizada pelo contexto");
          })
          .catch((err) => {
            console.error("Erro ao atualizar sessão pelo contexto:", err);
          });
      }
    },
    [updateSession],
  );

  // Função para buscar os dados mais recentes do usuário
  const refreshUserData = useCallback(async () => {
    if (!userData?.id && !session?.user?.id) {
      console.log("Sem ID de usuário, não é possível atualizar");
      return null;
    }

    // Verifica se a última atualização foi recente (menos de 5 segundos)
    const now = Date.now();
    if (now - lastUpdated < 5000) {
      console.log("Refresh ignorado: última atualização muito recente");
      return userData;
    }

    setIsRefreshing(true);
    try {
      const response = await fetch("/api/user/check");
      if (!response.ok) {
        console.error("Erro ao buscar dados do usuário:", response.statusText);
        return null;
      }

      const freshData = await response.json();
      console.log("Dados atualizados do usuário:", freshData);

      // Se recebeu resposta throttled, retorna os dados atuais
      if (freshData.throttled) {
        console.log("Resposta throttled, usando dados existentes");
        return userData;
      }

      // Atualiza o contexto apenas se houver diferenças
      if (JSON.stringify(userData) !== JSON.stringify(freshData)) {
        setUserData(freshData);
        setLastUpdated(now);

        // Atualiza a sessão somente se os dados críticos mudaram
        if (
          !userData ||
          userData.name !== freshData.name ||
          userData.email !== freshData.email
        ) {
          try {
            await updateSession({
              name: freshData.name,
              email: freshData.email,
            });
            console.log("Sessão atualizada com novos dados");
          } catch (error) {
            console.error("Erro ao atualizar sessão:", error);
            // Continua mesmo com erro na atualização da sessão
          }
        }
      } else {
        console.log("Dados já atualizados, ignorando atualização");
      }

      // Retorna os dados obtidos para que possam ser usados pelo chamador
      return freshData;
    } catch (error) {
      console.error("Erro ao atualizar dados do usuário:", error);
      return null;
    } finally {
      setIsRefreshing(false);
    }
  }, [userData, lastUpdated, updateSession, session?.user?.id]);

  // Atualiza os dados do usuário quando a sessão muda
  useEffect(() => {
    if (session?.user) {
      // Só atualiza se os dados da sessão forem diferentes dos dados atuais
      if (
        !userData ||
        userData.name !== session.user.name ||
        userData.email !== session.user.email
      ) {
        console.log("Atualizando contexto com dados da sessão:", session.user);
        setUserData(session.user as UserWithoutToken);
        setLastUpdated(Date.now());
      }
    }
  }, [session, userData]);

  // Atualiza periodicamente os dados (a cada 60 segundos)
  useEffect(() => {
    const interval = setInterval(() => {
      refreshUserData().then((data) => {
        if (data) {
          console.log("Dados periodicamente atualizados");
        }
      });
    }, 60000);

    return () => clearInterval(interval);
  }, [refreshUserData]);

  // Adiciona um listener para atualizar os dados quando o evento for disparado
  useEffect(() => {
    const handleStorageChange = () => {
      // Se for detectada uma atualização em outra aba, recarrega os dados
      refreshUserData();
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [refreshUserData]);

  return (
    <UserContext.Provider
      value={{
        userData,
        updateUserData,
        refreshUserData,
        isRefreshing,
        lastUpdated,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
