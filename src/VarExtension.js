import { Mark } from '@tiptap/core'

export const Var = Mark.create({
  name: 'var',
  
  // Definindo como a tag será renderizada no HTML
  renderHTML() {
    return ['var', 0]
  },
  
  // Parseando a tag da entrada HTML para o documento
  parseHTML() {
    return [
      {
        tag: 'var',
      },
    ]
  },
  
  // Adicionando o comando para ativar/desativar a tag var
  addCommands() {
    return {
      toggleVar: () => ({ commands }) => {
        return commands.toggleMark(this.name)
      },
    }
  },
  
  // Opcional: adicionar atalhos de teclado
  addKeyboardShortcuts() {
    return {
      'Mod-Shift-v': () => this.editor.commands.toggleVar(),
    }
  },
})