// Os três perfis de profissional parceiro: usados no menu, no hub /seja-parceiro e nas páginas de cadastro.

export type Profissao = 'psicologo' | 'cuidador' | 'adestrador'

export const PROFISSOES: {
  id: Profissao
  href: string
  menu: string
  titulo: string
  resumo: string
  selo: string
}[] = [
  {
    id: 'psicologo',
    href: '/seja-parceiro/psicologos',
    menu: 'Para psicólogos',
    titulo: 'Psicólogos',
    resumo: 'Atenda pessoas em luto pela perda de um pet, online ou presencial.',
    selo: 'Cadastro aberto',
  },
  {
    id: 'cuidador',
    href: '/seja-parceiro/cuidadores',
    menu: 'Para cuidadores',
    titulo: 'Cuidadores',
    resumo: 'Hospedagem, visitas, passeios e creche para pets do seu bairro.',
    selo: 'Piloto em Belo Horizonte',
  },
  {
    id: 'adestrador',
    href: '/seja-parceiro/adestradores',
    menu: 'Para adestradores',
    titulo: 'Adestradores',
    resumo: 'Aulas e consultoria de comportamento, com reforço positivo.',
    selo: 'Piloto em Belo Horizonte',
  },
]
