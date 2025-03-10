import React from "react";

import { Button } from "@/components/ui/button";
import { SignInModal } from "@/components/modals/sign-in-modal";

export function Header() {
  const [showSignInModal, setShowSignInModal] = React.useState(false);

  return (
    <header>
      {/* ... outros elementos ... */}
      <Button onClick={() => setShowSignInModal(true)}>Entrar</Button>
      <SignInModal isOpen={showSignInModal} onOpenChange={setShowSignInModal} />
    </header>
  );
}
