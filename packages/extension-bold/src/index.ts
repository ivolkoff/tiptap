import {
  Command, Mark, markInputRule, markPasteRule,
} from '@tiptap/core'

export interface BoldOptions {
  HTMLAttributes: {
    [key: string]: any
  },
}

export const starInputRegex = /(?:^|\s)((?:\*\*)((?:[^*]+))(?:\*\*))$/gm
export const starPasteRegex = /(?:^|\s)((?:\*\*)((?:[^*]+))(?:\*\*))/gm
export const underscoreInputRegex = /(?:^|\s)((?:__)((?:[^__]+))(?:__))$/gm
export const underscorePasteRegex = /(?:^|\s)((?:__)((?:[^__]+))(?:__))/gm

const Bold = Mark.create({
  name: 'bold',

  defaultOptions: <BoldOptions>{
    HTMLAttributes: {},
  },

  parseHTML() {
    return [
      {
        tag: 'strong',
      },
      {
        tag: 'b',
        getAttrs: node => (node as HTMLElement).style.fontWeight !== 'normal' && null,
      },
      {
        style: 'font-weight',
        getAttrs: value => /^(bold(er)?|[5-9]\d{2,})$/.test(value as string) && null,
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['strong', HTMLAttributes, 0]
  },

  addCommands() {
    return {
      /**
       * Add a bold mark
       */
      addBold: (): Command => ({ commands }) => {
        return commands.addMark('bold')
      },
      /**
       * Toggle a bold mark
       */
      toggleBold: (): Command => ({ commands }) => {
        return commands.toggleMark('bold')
      },
      /**
       * Remove a bold mark
       */
      removeBold: (): Command => ({ commands }) => {
        return commands.removeMark('bold')
      },
    }
  },

  addKeyboardShortcuts() {
    return {
      'Mod-b': () => this.editor.commands.toggleBold(),
    }
  },

  addInputRules() {
    return [
      markInputRule(starInputRegex, this.type),
      markInputRule(underscoreInputRegex, this.type),
    ]
  },

  addPasteRules() {
    return [
      markPasteRule(starPasteRegex, this.type),
      markPasteRule(underscorePasteRegex, this.type),
    ]
  },
})

export default Bold

declare module '@tiptap/core' {
  interface AllExtensions {
    Bold: typeof Bold,
  }
}
