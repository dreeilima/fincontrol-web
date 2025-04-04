const { execSync } = require('child_process');
const fs = require('fs');

// Verificar se o arquivo de bloqueio existe
if (fs.existsSync('pnpm-lock.yaml')) {
  console.log('Arquivo de bloqueio encontrado, removendo...');
  fs.unlinkSync('pnpm-lock.yaml');
}

// Executar a instalação sem o arquivo de bloqueio
console.log('Instalando dependências sem arquivo de bloqueio...');
try {
  execSync('pnpm install --no-frozen-lockfile', { stdio: 'inherit' });
  console.log('Instalação concluída com sucesso!');
} catch (error) {
  console.error('Erro durante a instalação:', error);
  process.exit(1);
}
