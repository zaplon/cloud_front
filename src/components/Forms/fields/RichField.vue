<template>
    <div class="editor">
        <editor-menu-bar :editor="editor" ref="editor">
            <div class="menubar" slot-scope="{ commands, isActive }">
                <button type="button" :class="{ 'active': isActive.bold() }" @click="commands.bold"
                        class="btn btn-secondary btn-sm">
                    <i class="fa fa-bold"></i>
                </button>
                <button type="button" :class="{ 'active': isActive.strike() }" @click="commands.strike"
                        class="btn btn-secondary btn-sm">
                    <i class="fa fa-italic"></i>
                </button>
                <button type="button" :class="{ 'active': isActive.underline() }" @click="commands.underline"
                        class="btn btn-secondary btn-sm">
                    <i class="fa fa-underline"></i>
                </button>
                <button type="button" :class="{ 'active': isActive.code() }" @click="commands.code"
                        class="btn btn-secondary btn-sm">
                    <i class="fa fa-code"></i>
                </button>
                <button type="button" :class="{ 'active': isActive.paragraph() }" @click="commands.paragraph"
                        class="btn btn-secondary btn-sm">
                    <i class="fa fa-paragraph"></i>
                </button>
                <button type="button" :class="{ 'active': isActive.heading({ level: 1 }) }" @click="commands.heading({ level: 1 })"
                        class="btn btn-secondary btn-sm">
                    H1
                </button>
                <button type="button" :class="{ 'active': isActive.heading({ level: 2 }) }" @click="commands.heading({ level: 2 })"
                        class="btn btn-secondary btn-sm">
                    H2
                </button>
                <button type="button" :class="{ 'active': isActive.heading({ level: 3 }) }" @click="commands.heading({ level: 3 })"
                        class="btn btn-secondary btn-sm">
                    H3
                </button>
                <button type="button" :class="{ 'active': isActive.bullet_list() }" @click="commands.bullet_list"
                        class="btn btn-secondary btn-sm">
                    <i class="fa fa-list-ul"></i>
                </button>
                <button type="button" :class="{ 'active': isActive.ordered_list() }" @click="commands.ordered_list"
                        class="btn btn-secondary btn-sm">
                    <i class="fa fa-list-ol"></i>
                </button>
                <button type="button" :class="{ 'active': isActive.blockquote() }" @click="commands.blockquote"
                        class="btn btn-secondary btn-sm">
                    <i class="fa fa-quote-left"></i>
                </button>
                <button type="button" :class="{ 'active': isActive.code_block() }" @click="commands.code_block"
                        class="btn btn-secondary btn-sm">
                    <i class="fa fa-code"></i>
                </button>
                <button type="button" @click="commands.undo"
                        class="btn btn-secondary btn-sm">
                    <i class="fa fa-undo"></i>
                </button>
            </div>
        </editor-menu-bar>
        <editor-content :editor="editor" :editable="editable" />
    </div>
</template>
<script>
import Icon from '@/components/Forms/fields/Icon'
import { Editor, EditorContent, EditorMenuBar } from 'tiptap'
import {
  Blockquote,
  CodeBlock,
  HardBreak,
  Heading,
  HorizontalRule,
  OrderedList,
  BulletList,
  ListItem,
  TodoItem,
  TodoList,
  Bold,
  Code,
  Italic,
  Link,
  Strike,
  Underline,
  History
} from 'tiptap-extensions'

export default {
  components: {
    EditorContent,
    EditorMenuBar,
    Icon
  },
  props: {
    editable: {
      type: Boolean,
      required: false,
      default: true
    },
    cls: {
      required: false,
      default: 'form-control editor__content'
    },
    content: {
      required: false,
      default: '',
      type: String
    }
  },
  data () {
    return {
      editor: new Editor({
        content: this.content,
        editorProps: {
          attributes: {
            class: 'form-control content-editor'
          }
        },
        extensions: [
          new Blockquote(),
          new BulletList(),
          new CodeBlock(),
          new HardBreak(),
          new Heading({ levels: [1, 2, 3] }),
          new HorizontalRule(),
          new ListItem(),
          new OrderedList(),
          new TodoItem(),
          new TodoList(),
          new Bold(),
          new Code(),
          new Italic(),
          new Link(),
          new Strike(),
          new Underline(),
          new History()
        ]
      })
    }
  },
  methods: {
    getHTML () {
      return this.editor.getHTML()
    }
  },
  setData (data) {
    this.editor.content = data
  },
  beforeDestroy () {
    this.editor.destroy()
  }
}
</script>
<style>
    .content-editor {
        min-height: 300px;
        overflow-y: auto;
    }
    .editor .menubar button {
        box-shadow: none;
    }
</style>
