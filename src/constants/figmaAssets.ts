export const FIGMA_ASSETS = {
  search: 'http://localhost:3845/assets/92c1d0c26b9cbd0feab09dcca01bd7068fc96a49.svg',
  pizza: 'http://localhost:3845/assets/db496637cd753f6bf9b84dd27d1e3e5c011e20e9.svg',
  settings: 'http://localhost:3845/assets/b7440c2a42e84455fc15a09f61fe017676b3cab8.svg',
  titleLine: 'http://localhost:3845/assets/626569243f7d060b82efe75a36e0e2f40ae9153e.svg',
  avatarRing: 'http://localhost:3845/assets/65bfb9162d6c2f3e63f20f694898ca096b1e3feb.svg',
  avatarIcon: 'http://localhost:3845/assets/35502902dcaf9424b914b12670869b106e04efe6.svg',
  avatarMask: 'http://localhost:3845/assets/d7a951986939b41adff966e8fa9cc545593f9772.svg',
  logoCantina: 'http://localhost:3845/assets/0b6e83f3d524d9ac45955234dcd8d7f6000dca00.svg',
  hamburger: 'http://localhost:3845/assets/bc5776f4c4dc6ad1bf3dfb98cfc282ad61a05967.svg',
  modalClose: 'http://localhost:3845/assets/8e8a8e02d0fdb26278966b864517cb98503506a2.svg',
} as const;

export const SIDEBAR_ASSETS = {
  logo: 'http://localhost:3845/assets/020a223bd10ec3e3fde07b7bf5eb3da38399847b.svg',
  schedule: 'http://localhost:3845/assets/f75f11b4acf9fc0dc01cc70b2bc998647ad0c4d0.svg',
  bag: 'http://localhost:3845/assets/ca00b73fd5f2a43fd284b40664b0143f2aa43c50.svg',
  settings: 'http://localhost:3845/assets/417f452b75414a8d9844e69e872daa334072b821.svg',
  exit: 'http://localhost:3845/assets/692878aea19d46faf817e7b7ae55105ee679a631.svg',
} as const;

export type SidebarNavId =
  | 'logo'
  | 'alunos'
  | 'historico'
  | 'configuracoes'
  | 'sair';
