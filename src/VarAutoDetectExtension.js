import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from 'prosemirror-state'

export const VarAutoDetect = Extension.create({
  name: 'varAutoDetect',

  addProseMirrorPlugins() {
    // Regex para encontrar padrões {{texto}}
    const varRegex = /\{\{([^{}]+)\}\}/g

    return [
      new Plugin({
        key: new PluginKey('varAutoDetect'),
        appendTransaction: (transactions, oldState, newState) => {
          // Se não houve mudanças no texto, não fazemos nada
          if (!transactions.some(tr => tr.docChanged)) return null
          
          // Obtém o documento atual
          const { doc } = newState
          
          // Cria uma nova transação
          const tr = newState.tr
          let modificado = false

          // Processa cada nó de texto no documento
          doc.descendants((node, pos) => {
            if (!node.isText) return
            
            // Primeiro removemos todas as marcas var existentes neste nó
            const from = pos
            const to = pos + node.nodeSize
            tr.removeMark(from, to, newState.schema.marks.var)
            
            // Depois aplicamos as marcas var apenas aos textos com {{}}
            // Reinicia a regex para cada texto
            varRegex.lastIndex = 0
            let match

            // Processa cada ocorrência do padrão {{...}}
            while ((match = varRegex.exec(node.text)) !== null) {
              const matchStart = pos + match.index
              const matchEnd = matchStart + match[0].length
              
              // Verifica se o texto dentro de {{}} contém espaços
              const textoVar = match[1];
              const textoFormatado = textoVar.replace(/\s+/g, '-');
              
              // Se houver espaços, substituir por hífens
              if (textoVar !== textoFormatado) {
                // Calcula o novo texto com hífens
                const novoTexto = '{{' + textoFormatado + '}}';
                
                // Substitui o texto original pelo formatado
                tr.replaceWith(
                  matchStart,
                  matchEnd,
                  newState.schema.text(novoTexto)
                );
                
                // Aplica a tag var ao novo texto com hífens
                // Aqui é importante calcular a nova posição após a substituição
                tr.addMark(
                  matchStart, 
                  matchStart + novoTexto.length, 
                  newState.schema.marks.var.create()
                );
                
                // Ajusta regex para evitar loop infinito
                varRegex.lastIndex = matchStart + novoTexto.length;
                
                modificado = true;
              } else {
                // Aplica a tag var ao conteúdo incluindo as chaves {{}}
                tr.addMark(
                  matchStart, 
                  matchEnd, 
                  newState.schema.marks.var.create()
                );
                
                modificado = true;
              }
            }
          })
          
          return modificado ? tr : null
        },
      }),
    ]
  },
})
