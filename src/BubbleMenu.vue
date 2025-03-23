<template>
  <div class="bubble-menu">
    <button
      class="menu-button"
      @click="editor.chain().focus().toggleBold().run()"
      :class="{ 'is-active': editor.isActive('bold') }"
    >
      <span class="wwi wwi-bold"></span>
    </button>
    <button
      class="menu-button"
      @click="editor.chain().focus().toggleItalic().run()"
      :class="{ 'is-active': editor.isActive('italic') }"
    >
      <span class="wwi wwi-italic"></span>
    </button>
    <button
      class="menu-button"
      @click="editor.chain().focus().toggleStrike().run()"
      :class="{ 'is-active': editor.isActive('strike') }"
    >
      <span class="wwi wwi-strikethrough"></span>
    </button>
    <button
      class="menu-button"
      @click="editor.chain().focus().toggleHighlight().run()"
      :class="{ 'is-active': editor.isActive('highlight') }"
    >
      <span class="wwi wwi-marker"></span>
    </button>
    <button
      class="menu-button"
      @click="setLink"
    >
      <span class="wwi wwi-link"></span>
    </button>
  </div>
</template>

<script>
export default {
  props: {
    editor: {
      type: Object,
      required: true,
    },
  },
  methods: {
    setLink() {
      const previousUrl = this.editor.getAttributes('link').href;
      const url = window.prompt('URL', previousUrl);

      // cancelled
      if (url === null) {
        return;
      }

      // empty
      if (url === '') {
        this.editor.chain().focus().extendMarkRange('link').unsetLink().run();
        return;
      }

      // update link
      this.editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    },
  },
};
</script>

<style>
.bubble-menu {
  display: flex;
  background-color: #fff;
  padding: 0.2rem;
  border-radius: 0.5rem;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.05), 0px 10px 20px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.menu-button {
  border: none;
  background: none;
  color: #0D0D0D;
  font-size: 1rem;
  padding: 0.2rem 0.5rem;
  margin-right: 0.2rem;
  border-radius: 0.3rem;
  cursor: pointer;
}

.menu-button:last-child {
  margin-right: 0;
}

.menu-button:hover {
  background-color: #F1F1F1;
}

.menu-button.is-active {
  background-color: #DBEAFE;
  color: #2563EB;
}

.wwi {
  font-size: 1rem;
  line-height: 1.5;
}
</style>
