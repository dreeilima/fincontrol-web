#!/bin/bash

# Tentar instalar até 3 vezes
for i in {1..3}; do
  echo "Tentativa $i de instalação..."
  pnpm install --no-frozen-lockfile && break || {
    if [ $i -lt 3 ]; then
      echo "Falha na instalação, tentando novamente em 10 segundos..."
      sleep 10
    else
      echo "Falha na instalação após 3 tentativas."
      exit 1
    fi
  }
done

# Executar o build
pnpm run build
