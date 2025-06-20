// lib/tiptap/FontSize.js
import { Mark, mergeAttributes } from '@tiptap/core'

export const FontSize = Mark.create({
  name: 'fontSize',

  addAttributes() {
    return {
      fontSize: {
        default: null,
        parseHTML: element => element.style.fontSize || null,
        renderHTML: attributes => {
          if (!attributes.fontSize) return {}
          return { style: `font-size: ${attributes.fontSize}` }
        },
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'span[style*=font-size]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(HTMLAttributes), 0]
  },

  addCommands() {
    return {
      setFontSize:
        size =>
        ({ commands }) => {
          return commands.setMark(this.name, { fontSize: size })
        },
    }
  },
})
