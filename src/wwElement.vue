<template>
    <div class="ww-rich-text-editor-component" :class="{ '-readonly': isReadonly, editing: isEditing }" data-capture>
        <template v-if="richEditor">
            <div class="ww-rich-text-editor-component__menu native-menu" v-if="!hideMenu && !content.customMenu" :style="menuStyles">
                <!-- Texte type (normal, ...) -->
                <select id="rich-size" v-model="currentTextType" :disabled="!isEditable" v-if="menu.textType">
                    <option v-for="option in textTypeOptions" :key="option.value" :value="option.value">
                        {{ option.label }}
                    </option>
                </select>

                <span class="separator" v-if="menu.textType"></span>

                <!-- Bold, Italic, Underline -->
                <button
                    type="button"
                    class="ww-rich-text-editor-component__menu-item"
                    @click="toggleBold"
                    :class="{ 'is-active': richEditor.isActive('bold') }"
                    :disabled="!isEditable"
                    v-if="menu.bold"
                >
                    <i class="fas fa-bold"></i>
                </button>
                <button
                    type="button"
                    class="ww-rich-text-editor-component__menu-item"
                    @click="toggleItalic"
                    :class="{ 'is-active': richEditor.isActive('italic') }"
                    :disabled="!isEditable"
                    v-if="menu.italic"
                >
                    <i class="fas fa-italic"></i>
                </button>
                <button
                    type="button"
                    class="ww-rich-text-editor-component__menu-item"
                    @click="toggleUnderline"
                    :class="{ 'is-active': richEditor.isActive('underline') }"
                    :disabled="!isEditable"
                    v-if="menu.underline"
                >
                    <i class="fas fa-underline"></i>
                </button>
                <button
                    type="button"
                    class="ww-rich-text-editor-component__menu-item"
                    @click="toggleStrike"
                    :class="{ 'is-active': richEditor.isActive('strike') }"
                    :disabled="!isEditable"
                    v-if="menu.strike"
                >
                    <i class="fas fa-strikethrough"></i>
                </button>

                <!-- Show the separator only if at least on of the previous block are visible -->
                <span class="separator" v-if="menu.bold || menu.italic || menu.underline || menu.strike"></span>

                <!-- Text align -->
                <button
                    type="button"
                    class="ww-rich-text-editor-component__menu-item"
                    @click="setTextAlign('left')"
                    :class="{ 'is-active': richEditor.isActive({ textAlign: 'left' }) }"
                    :disabled="!isEditable"
                    v-if="menu.alignLeft"
                >
                    <i class="fas fa-align-left"></i>
                </button>

                <button
                    type="button"
                    class="ww-rich-text-editor-component__menu-item"
                    @click="setTextAlign('center')"
                    :class="{ 'is-active': richEditor.isActive({ textAlign: 'center' }) }"
                    :disabled="!isEditable"
                    v-if="menu.alignCenter"
                >
                    <i class="fas fa-align-center"></i>
                </button>

                <button
                    type="button"
                    class="ww-rich-text-editor-component__menu-item"
                    @click="setTextAlign('right')"
                    :class="{ 'is-active': richEditor.isActive({ textAlign: 'right' }) }"
                    :disabled="!isEditable"
                    v-if="menu.alignRight"
                >
                    <i class="fas fa-align-right"></i>
                </button>

                <button
                    type="button"
                    class="ww-rich-text-editor-component__menu-item"
                    @click="setTextAlign('justify')"
                    :class="{ 'is-active': richEditor.isActive({ textAlign: 'justify' }) }"
                    :disabled="!isEditable"
                    v-if="menu.alignJustify"
                >
                    <i class="fas fa-align-justify"></i>
                </button>

                <span
                    class="separator"
                    v-if="menu.alignLeft || menu.alignCenter || menu.alignRight || menu.alignJustify"
                ></span>

                <!-- Color -->
                <label
                    class="ww-rich-text-editor-component__menu-item"
                    :for="`rich-color-${randomUid}`"
                    @click="richEditor.commands.focus()"
                    v-if="menu.textColor"
                >
                    <i class="fas fa-palette"></i>
                    <input
                        :id="`rich-color-${randomUid}`"
                        type="color"
                        @input="setColor($event.target.value)"
                        :value="richEditor.getAttributes('textStyle').color"
                        style="display: none"
                        :disabled="!isEditable"
                    />
                </label>

                <span class="separator" v-if="menu.textColor"></span>

                <!-- List (Bullet, number) -->
                <button
                    type="button"
                    class="ww-rich-text-editor-component__menu-item"
                    @click="toggleBulletList"
                    :class="{ 'is-active': richEditor.isActive('bulletList') }"
                    :disabled="!isEditable"
                    v-if="menu.bulletList"
                >
                    <i class="fas fa-list-ul"></i>
                </button>
                <button
                    type="button"
                    class="ww-rich-text-editor-component__menu-item"
                    @click="toggleOrderedList"
                    :class="{ 'is-active': richEditor.isActive('orderedList') }"
                    :disabled="!isEditable"
                    v-if="menu.orderedList"
                >
                    <i class="fas fa-list-ol"></i>
                </button>
                <button
                    type="button"
                    class="ww-rich-text-editor-component__menu-item"
                    @click="toggleTaskList"
                    :class="{ 'is-active': richEditor.isActive('taskList') }"
                    :disabled="!isEditable"
                    v-if="menu.taskList"
                >
                    <i class="fas fa-check-square"></i>
                </button>

                <!-- Variável (tag var) -->
                <button
                    type="button"
                    class="ww-rich-text-editor-component__menu-item"
                    @click="toggleVar"
                    :class="{ 'is-active': richEditor.isActive('var') }"
                    :disabled="!isEditable"
                    v-if="menu.var"
                >
                    <i class="fas fa-code"></i> var
                </button>

                <span class="separator" v-if="menu.codeBlock && (menu.bulletList || menu.orderedList || menu.taskList)"></span>

                <!-- Code -->
                <button
                    type="button"
                    class="ww-rich-text-editor-component__menu-item"
                    @click="toggleCodeBlock"
                    :class="{ 'is-active': richEditor.isActive('codeBlock') }"
                    :disabled="!isEditable"
                    v-if="menu.codeBlock"
                >
                    <i class="fas fa-code"></i>
                </button>

                <!-- Quote -->
                <button
                    type="button"
                    class="ww-rich-text-editor-component__menu-item"
                    @click="toggleBlockquote"
                    :class="{ 'is-active': richEditor.isActive('blockquote') }"
                    :disabled="!isEditable"
                    v-if="menu.blockquote"
                >
                    <i class="fas fa-quote-left"></i>
                </button>

                <span class="separator" v-if="menu.link || menu.image || menu.codeBlock || menu.blockquote"></span>

                <!-- Link -->
                <button
                    type="button"
                    class="ww-rich-text-editor-component__menu-item"
                    @click="setLink()"
                    :class="{ 'is-active': richEditor.isActive('link') }"
                    :disabled="!isEditable"
                    v-if="menu.link"
                >
                    <i class="fas fa-link"></i>
                </button>

                <!-- Image -->
                <button
                    type="button"
                    class="ww-rich-text-editor-component__menu-item"
                    @click="setImage()"
                    :disabled="!isEditable"
                    v-if="menu.image"
                >
                    <i class="fas fa-image"></i>
                </button>

                <!-- Undo/Redo -->
                <button
                    type="button"
                    class="ww-rich-text-editor-component__menu-item"
                    @click="undo"
                    :disabled="!isEditable"
                    v-if="menu.undo"
                >
                    <i class="fas fa-undo"></i>
                </button>
                <button
                    type="button"
                    class="ww-rich-text-editor-component__menu-item"
                    @click="redo"
                    :disabled="!isEditable"
                    v-if="menu.redo"
                >
                    <i class="fas fa-redo"></i>
                </button>
            </div>
            <wwElement class="ww-rich-text-editor-component__menu" v-else-if="content.customMenu" v-bind="content.customMenuElement" />

            <div class="rich-editor" :style="{ background: content.disableBackground ? 'transparent' : 'transparent' }">
                <editor-content class="ww-rich-text-editor-component__input" :editor="richEditor" :style="richStyles" />
            </div>
        </template>
    </div>
</template>

<script>
import { Editor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import TextStyle from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import { FontFamily } from '@tiptap/extension-font-family';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import TextAlign from '@tiptap/extension-text-align';
import CodeBlock from '@tiptap/extension-code-block';
import Mention from '@tiptap/extension-mention';
import { Var } from './VarExtension.js';
import { VarAutoDetect } from './VarAutoDetectExtension.js';
import { computed, inject } from 'vue';

function extractMentions(acc, currentNode) {
    if (currentNode.type === 'mention') {
        acc.push(currentNode.attrs.id);
        return acc;
    } else if (currentNode.content) {
        return currentNode.content.reduce(extractMentions, acc);
    } else {
        return acc;
    }
}

const TAGS_MAP = {
    p: 0,
    h1: 1,
    h2: 2,
    h3: 3,
    h4: 4,
    h5: 5,
    h6: 6,
};

export default {
    name: 'EditorDeTextoRich',
    components: {
        EditorContent,
    },
    props: {
        content: { type: Object, required: true },
        uid: { type: String, required: true },
        wwElementState: { type: Object, required: true },
        /* wwEditor:start */
        wwEditorState: { type: Object, required: true },
        wwFrontState: { type: Object, required: true },
        /* wwEditor:end */
        useForm: { type: Boolean, default: true },
    },
    emits: ['trigger-event', 'update:content:effect', 'update:sidepanel-content'],
    setup(props, { emit }) {
        const { value: variableValue, setValue } = wwLib.wwVariable.useComponentVariable({
            uid: props.uid,
            name: 'value',
            type: 'string',
            defaultValue: computed(() => String(props.content.initialValue || '')),
        });

        const { value: variableMentions, setValue: setMentions } = wwLib.wwVariable.useComponentVariable({
            uid: props.uid,
            name: 'mentions',
            type: 'array',
            defaultValue: [],
            readonly: true,
        });

        const { value: states, setValue: setStates } = wwLib.wwVariable.useComponentVariable({
            uid: props.uid,
            name: 'states',
            type: 'object',
            defaultValue: {},
            readonly: true,
        });

        const { value: variables, setValue: setVariables } = wwLib.wwVariable.useComponentVariable({
            uid: props.uid,
            name: 'variables',
            type: 'array',
            defaultValue: [],
            readonly: true,
        });

        const { value: textoSelecionado, setValue: setTextoSelecionado } = wwLib.wwVariable.useComponentVariable({
            uid: props.uid,
            name: 'textoSelecionado',
            type: 'string',
            defaultValue: '',
            readonly: true,
        });

        const { value: selecaoInfo, setValue: setSelecaoInfo } = wwLib.wwVariable.useComponentVariable({
            uid: props.uid,
            name: 'selecaoInfo',
            type: 'object',
            defaultValue: {
                ativo: false,
                posicao: {
                    x: 0,
                    y: 0,
                    largura: 0,
                    altura: 0
                }
            },
            readonly: true,
        });

        /* wwEditor:start */
        const { createElement } = wwLib.useCreateElement();
        /* wwEditor:end */

        const randomUid = wwLib.wwUtils.getUid();

        const useForm = inject('_wwForm:useForm', () => {});

        const fieldName = computed(() => props.content.fieldName);
        const validation = computed(() => props.content.validation);
        const customValidation = computed(() => props.content.customValidation);

        useForm(
            variableValue,
            { fieldName, validation, customValidation },
            { elementState: props.wwElementState, emit, sidepanelFormPath: 'form' }
        );

        return {
            variableValue,
            setValue,
            variableMentions,
            setMentions,
            states,
            setStates,
            variables,
            setVariables,
            textoSelecionado,
            setTextoSelecionado,
            selecaoInfo,
            setSelecaoInfo,
            randomUid,
            /* wwEditor:start */
            createElement,
            /* wwEditor:end */
        };
    },
    data() {
        return {
            richEditor: null,
            loading: false,
            processChangeTimeout: null,
            debounceTimeoutId: null,
            currentSelection: null,
            currentSelectionEmpty: true,
            textVariables: [],
            ultimaSelecao: null,
        };
    },

    watch: {
        'content.initialValue'(value) {
            if (value !== this.getContent()) {
                this.richEditor.commands.setContent(value);
                this.setValue(value);
            }
            this.$emit('trigger-event', { name: 'initValueChange', event: { value } });

            if (this.isReadonly) this.handleOnUpdate();
        },
        'content.editable': function(value) {
            if (this.richEditor) {
                this.richEditor.setEditable(value !== false);
            }
        },
        'wwElementState.props.editable': function(value) {
            if (this.richEditor) {
                this.richEditor.setEditable(value !== false);
            }
        },
        variableValue(value) {
            if (value !== this.getContent()) this.richEditor.commands.setContent(value);
            // If format changed
            if (value !== this.getContent()) this.setValue(this.getContent());
        },
        'content.text': {
            deep: true,
            handler(newContent) {
                this.initContent(newContent);
                this.extractVariables(newContent);
            },
        },
        /* wwEditor:start */
        editorConfig() {
            this.loadEditor();
        },
        'wwEditorState.boundProps.mentionList'(isBind) {
            if (!isBind)
                this.$emit('update:content:effect', {
                    mentionIdPath: null,
                    mentionLabelPath: null,
                });
        },
        // For updating legacy elements before introduction of custom menu
        'content.customMenu': {
            async handler(value) {
                if (value && !this.content.customMenuElement) {
                    const element = await this.createElement('ww-flexbox', {
                        _state: {
                            name: 'Custom menu container',
                            style: {
                                default: {
                                    width: '100%',
                                },
                            },
                        },
                    });
                    this.$emit('update:content:effect', {
                        customMenuElement: element,
                    });
                }
            },
            immediate: true,
        },
        'wwEditorState.isSelected'() {
            this.$emit('update:sidepanel-content', { path: 'selectedTag', value: null });
        },
        /* wwEditor:end */
        isReadonly: {
            immediate: true,
            handler(value) {
                if (value) {
                    this.$emit('add-state', 'readonly');
                } else {
                    this.$emit('remove-state', 'readonly');
                }
            },
        },
        editorStates: {
            deep: true,
            immediate: true,
            handler(value) {
                this.setStates(value);
            },
        },
    },
    computed: {
        isEditing() {
            /* wwEditor:start */
            return this.wwEditorState.editMode === wwLib.wwEditorHelper.EDIT_MODES.EDITION;
            /* wwEditor:end */
            // eslint-disable-next-line no-unreachable
            return false;
        },
        editorStates() {
            if (!this.richEditor) return {};
            return {
                textType: Object.keys(TAGS_MAP).find(key => TAGS_MAP[key] === this.currentTextType),
                textColor: this.currentColor,
                bold: this.richEditor.isActive('bold'),
                italic: this.richEditor.isActive('italic'),
                underline: this.richEditor.isActive('underline'),
                strike: this.richEditor.isActive('strike'),
                bulletList: this.richEditor.isActive('bulletList'),
                orderedList: this.richEditor.isActive('orderedList'),
                checkList: this.richEditor.isActive('taskList'),
                link: this.richEditor.isActive('link'),
                codeBlock: this.richEditor.isActive('codeBlock'),
                blockquote: this.richEditor.isActive('blockquote'),
                var: this.richEditor.isActive('var'),
                textAlign: this.richEditor.isActive({ textAlign: 'left' })
                    ? 'left'
                    : this.richEditor.isActive({ textAlign: 'center' })
                      ? 'center'
                      : this.richEditor.isActive({ textAlign: 'right' })
                        ? 'right'
                        : this.richEditor.isActive({ textAlign: 'justify' })
                          ? 'justify'
                          : false,
                table: this.richEditor.isActive('table'),
            };
        },
        currentColor() {
            if (this.richEditor.getAttributes('textStyle')?.color)
                return this.richEditor.getAttributes('textStyle')?.color;
            else if (this.richEditor.isActive('link')) return this.content.a.color;
            else if (this.richEditor.isActive('codeBlock')) return this.content.code.color;
            else if (this.richEditor.isActive('blockquote')) return this.content.blockquote.color;
            else return this.content[Object.keys(TAGS_MAP).find(key => TAGS_MAP[key] === this.currentTextType)]?.color;
        },
        mentionList() {
            // Obtem a lista de menções das propriedades
            let result = [];
            
            // Verifica se a menção está ativada
            if (!this.content.enableMention) return [];
            
            console.log('Processando mentionList, content:', this.content);
            
            // Primeiro verificar se tem itens configurados diretamente
            if (Array.isArray(this.content.suggestions)) {
                result = this.content.suggestions.map(item => ({
                    id: item.id,
                    label: item.label
                })).filter(item => item.id !== undefined && item.label !== undefined);
                
                console.log('Itens encontrados em content.suggestions:', result);
                
                if (result.length > 0) {
                    return result;
                }
            }
            
            // Verificar itens individuais configurados
            const configItems = [];
            for (let i = 1; i <= 20; i++) {
                const itemKey = `item${i}`;
                if (this.content[itemKey] && 
                    this.content[itemKey].id !== undefined && 
                    this.content[itemKey].label !== undefined) {
                    configItems.push({
                        id: this.content[itemKey].id,
                        label: this.content[itemKey].label
                    });
                }
            }
            
            if (configItems.length > 0) {
                console.log('Itens encontrados configurados diretamente:', configItems);
                return configItems;
            }
            
            // Verifica se é uma variável ou array direto
            if (typeof this.content.mentionList === 'string') {
                // É uma variável bindable
                result = wwLib.wwVariable.getValue(this.content.mentionList) || [];
                console.log('MentionList de variável bindable:', result);
            } else if (Array.isArray(this.content.mentionList)) {
                // É um array direto
                result = this.content.mentionList;
                console.log('MentionList de array direto:', result);
            }
            
            // Se ainda não conseguiu uma lista, tenta recuperar diretamente com wwCollection
            if (!result || !result.length) {
                try {
                    const data = wwLib.wwCollection.getCollectionData(this.content.mentionList);
                    if (Array.isArray(data) && data.length) {
                        result = data;
                        console.log('MentionList de wwCollection.getCollectionData:', result);
                    }
                } catch (e) {
                    console.error('Erro ao usar wwCollection.getCollectionData:', e);
                }
            }
            
            // Processa conforme os path ou não
            if (result && result.length && this.content.mentionIdPath && this.content.mentionLabelPath) {
                // Se tiver caminhos definidos, mapeia
                console.log('Mapeando usando paths -', 'idPath:', this.content.mentionIdPath, 'labelPath:', this.content.mentionLabelPath);
                return result.map(item => {
                    if (!item) return null;
                    try {
                        const id = wwLib.wwCollection.getDataFromPath(item, this.content.mentionIdPath);
                        const label = wwLib.wwCollection.getDataFromPath(item, this.content.mentionLabelPath);
                        return { id, label };
                    } catch (e) {
                        console.error('Erro ao mapear item com path:', e, item);
                        return null;
                    }
                }).filter(Boolean);
            } else {
                // Se não tiver caminhos, usa direto os campos id e label
                console.log('Usando os campos id e label diretamente');
                return result;
            }
        },
        mentionListLength() {
            if (!this.content.mentionListLength || isNaN(this.content.mentionListLength)) return 5;
            return this.content.mentionListLength;
        },
        isReadonly() {
            return this.wwElementState.props.readonly === undefined
                ? this.content.readonly
                : this.wwElementState.props.readonly;
        },
        isEditable() {
            return true; // Forçando o editor a sempre ser editável
        },
        hideMenu() {
            return this.content.hideMenu || this.isReadonly;
        },
        menu() {
            return {
                textType: this.content.parameterTextType ?? true,
                bold: this.content.parameterBold ?? true,
                italic: this.content.parameterItalic ?? true,
                underline: this.content.parameterUnderline ?? true,
                strike: this.content.parameterStrike ?? true,
                alignLeft: this.content.parameterAlignLeft ?? false,
                alignCenter: this.content.parameterAlignCenter ?? false,
                alignRight: this.content.parameterAlignRight ?? false,
                alignJustify: this.content.parameterAlignJustify ?? false,
                textColor: this.content.parameterTextColor ?? true,
                bulletList: this.content.parameterBulletList ?? true,
                orderedList: this.content.parameterOrderedList ?? true,
                taskList: this.content.parameterTaskList ?? false,

                table: this.content.parameterTable ?? false,

                link: this.content.parameterLink ?? true,
                image: this.content.parameterImage ?? false,
                codeBlock: this.content.parameterCodeBlock ?? true,
                blockquote: this.content.parameterQuote ?? true,
                undo: this.content.parameterUndo ?? true,
                redo: this.content.parameterRedo ?? true,
                var: this.content.parameterVar ?? false,
            };
        },
        editorConfig() {
            return {
                placeholder: wwLib.wwLang.getText(this.content.placeholder),
                autofocus: this.content.autofocus,
                image: {
                    inline: this.content.img?.inline,
                    allowBase64: true,
                },
                mention: {
                    enabled: this.content.enableMention,
                    list: this.mentionList,
                    allowSpaces: this.content.mentionAllowSpaces,
                    char: this.content.mentionChar,
                    renderLabel: ({ node }) => {
                        // Quando o usuário clica em uma menção existente
                        this.$emit('trigger-event', {
                            name: 'mention:click',
                            event: {
                                mention: {
                                    id: node.attrs.id,
                                    label: node.attrs.label,
                                },
                            },
                        });
                        return `${this.content.mentionChar || '@'}${node.attrs.label}`;
                    },
                    suggestion: {
                        items: ({ query }) => {
                            console.log('Query menções:', query);
                            console.log('Lista de menções calculada:', this.mentionList);
                            
                            // Usa a propriedade computada para obter a lista de menções
                            let items = this.mentionList || [];
                            
                            // Se não há itens, retorna vazio
                            if (!items.length) {
                                console.log('Lista de menções vazia');
                                return [];
                            }
                            
                            // Filtra a lista baseado na consulta
                            if (query) {
                                const searchString = query.toLowerCase();
                                items = items.filter(item => {
                                    if (!item || !item.label) return false;
                                    
                                    try {
                                        return item.label.toString().toLowerCase().includes(searchString);
                                    } catch (e) {
                                        console.error('Erro ao filtrar item de menção:', e);
                                        return false;
                                    }
                                });
                                
                                console.log('Items após filtrar por query:', items);
                            }
                            
                            // Limita a quantidade de itens pelo valor definido nas propriedades
                            const limit = parseInt(this.content.mentionListLength) || 5;
                            const result = items.slice(0, limit);
                            
                            console.log('Resultado final:', result);
                            return result;
                        },
                        render: () => {
                            let popup = null;
                            let selectedIndex = 0;
                            
                            const renderPopup = (items, command) => {
                                if (!popup) return;
                                
                                // Limpa o conteúdo do popup
                                popup.innerHTML = '';
                                
                                if (!items || !items.length) {
                                    const noResultsItem = document.createElement('div');
                                    noResultsItem.className = 'item';
                                    noResultsItem.textContent = 'Nenhum resultado';
                                    popup.appendChild(noResultsItem);
                                    return;
                                }
                                
                                // Renderiza cada item da lista
                                items.forEach((item, index) => {
                                    const button = document.createElement('button');
                                    button.className = 'item';
                                    if (index === selectedIndex) {
                                        button.className += ' is-selected';
                                    }
                                    button.textContent = item.label;
                                    
                                    button.addEventListener('click', () => {
                                        command(item);
                                    });
                                    
                                    popup.appendChild(button);
                                });
                            };
                            
                            return {
                                onStart: props => {
                                    // Reset do índice selecionado
                                    selectedIndex = 0;
                                    
                                    // Cria o elemento para o popup
                                    popup = document.createElement('div');
                                    popup.className = 'mention-suggestion items';
                                    document.body.appendChild(popup);
                                    
                                    // Renderiza o popup com os itens iniciais
                                    renderPopup(props.items, props.command);
                                    
                                    // Posicionar o popup
                                    const coords = this.richEditor.view.coordsAtPos(props.range.from);
                                    popup.style.position = 'absolute';
                                    popup.style.left = `${coords.left}px`;
                                    popup.style.top = `${coords.bottom}px`;
                                    popup.style.zIndex = '9999';
                                },
                                onUpdate: props => {
                                    renderPopup(props.items, props.command);
                                },
                                onKeyDown: props => {
                                    if (!popup || !props || !props.items || !props.items.length) {
                                        return false;
                                    }
                                    
                                    // Lidar com as teclas de navegação
                                    if (props.event.key === 'ArrowUp') {
                                        selectedIndex = ((selectedIndex + props.items.length) - 1) % props.items.length;
                                        renderPopup(props.items, props.command);
                                        return true;
                                    }
                                    
                                    if (props.event.key === 'ArrowDown') {
                                        selectedIndex = (selectedIndex + 1) % props.items.length;
                                        renderPopup(props.items, props.command);
                                        return true;
                                    }
                                    
                                    if (props.event.key === 'Enter') {
                                        const item = props.items[selectedIndex];
                                        if (item) {
                                            props.command(item);
                                        }
                                        return true;
                                    }
                                    
                                    if (props.event.key === 'Escape') {
                                        return true;
                                    }
                                    
                                    return false;
                                },
                                onExit: () => {
                                    if (popup) {
                                        document.body.removeChild(popup);
                                        popup = null;
                                    }
                                },
                            };
                        },
                    },
                },
            };
        },
        currentTextType: {
            get() {
                const currentType = this.textTypeOptions.find(option => option.active);
                return currentType ? currentType.value : 0;
            },
            set(value) {
                this.setTag(value);
            },
        },
        textTypeOptions() {
            if (!this.richEditor) return [];
            return [
                { label: 'Paragraph', value: 0, active: this.richEditor.isActive('paragraph') },
                { label: 'Heading 1', value: 1, active: this.richEditor.isActive('heading', { level: 1 }) },
                { label: 'Heading 2', value: 2, active: this.richEditor.isActive('heading', { level: 2 }) },
                { label: 'Heading 3', value: 3, active: this.richEditor.isActive('heading', { level: 3 }) },
                { label: 'Heading 4', value: 4, active: this.richEditor.isActive('heading', { level: 4 }) },
                { label: 'Heading 5', value: 5, active: this.richEditor.isActive('heading', { level: 5 }) },
                { label: 'Heading 6', value: 6, active: this.richEditor.isActive('heading', { level: 6 }) },
            ];
        },
        menuStyles() {
            return {
                '--menu-color': this.content.menuColor,
                'flex-wrap': this.content.wrapMenu ? 'wrap' : 'nowrap',
            };
        },
        richStyles() {
            return {
                display: 'flex',
                flex: 1,
                overflow: 'auto',
                // H1
                '--h1-fontSize': this.content.h1 && this.content.h1.fontSize ? this.content.h1.fontSize : '24px',
                '--h1-fontFamily': this.content.h1 && this.content.h1.fontFamily ? this.content.h1.fontFamily : '',
                '--h1-fontWeight': this.content.h1 && this.content.h1.fontWeight ? this.content.h1.fontWeight : 'bold',
                '--h1-textAlign': this.content.h1 && this.content.h1.textAlign ? this.content.h1.textAlign : 'left',
                '--h1-color': this.content.h1 && this.content.h1.color ? this.content.h1.color : '#000',
                '--h1-lineHeight': this.content.h1 && this.content.h1.lineHeight ? this.content.h1.lineHeight : '1.2',
                '--h1-margin-top': this.content.h1 && this.content.h1.marginTop ? this.content.h1.marginTop : '16px',
                '--h1-margin-bottom': this.content.h1 && this.content.h1.marginBottom ? this.content.h1.marginBottom : '8px',
                // H2
                '--h2-fontSize': this.content.h2 && this.content.h2.fontSize ? this.content.h2.fontSize : '22px',
                '--h2-fontFamily': this.content.h2 && this.content.h2.fontFamily ? this.content.h2.fontFamily : '',
                '--h2-fontWeight': this.content.h2 && this.content.h2.fontWeight ? this.content.h2.fontWeight : 'bold',
                '--h2-textAlign': this.content.h2 && this.content.h2.textAlign ? this.content.h2.textAlign : 'left',
                '--h2-color': this.content.h2 && this.content.h2.color ? this.content.h2.color : '#000',
                '--h2-lineHeight': this.content.h2 && this.content.h2.lineHeight ? this.content.h2.lineHeight : '1.2',
                '--h2-margin-top': this.content.h2 && this.content.h2.marginTop ? this.content.h2.marginTop : '16px',
                '--h2-margin-bottom': this.content.h2 && this.content.h2.marginBottom ? this.content.h2.marginBottom : '8px',
                // H3
                '--h3-fontSize': this.content.h3 && this.content.h3.fontSize ? this.content.h3.fontSize : '20px',
                '--h3-fontFamily': this.content.h3 && this.content.h3.fontFamily ? this.content.h3.fontFamily : '',
                '--h3-fontWeight': this.content.h3 && this.content.h3.fontWeight ? this.content.h3.fontWeight : 'bold',
                '--h3-textAlign': this.content.h3 && this.content.h3.textAlign ? this.content.h3.textAlign : 'left',
                '--h3-color': this.content.h3 && this.content.h3.color ? this.content.h3.color : '#000',
                '--h3-lineHeight': this.content.h3 && this.content.h3.lineHeight ? this.content.h3.lineHeight : '1.2',
                '--h3-margin-top': this.content.h3 && this.content.h3.marginTop ? this.content.h3.marginTop : '16px',
                '--h3-margin-bottom': this.content.h3 && this.content.h3.marginBottom ? this.content.h3.marginBottom : '8px',
                // H4
                '--h4-fontSize': this.content.h4 && this.content.h4.fontSize ? this.content.h4.fontSize : '18px',
                '--h4-fontFamily': this.content.h4 && this.content.h4.fontFamily ? this.content.h4.fontFamily : '',
                '--h4-fontWeight': this.content.h4 && this.content.h4.fontWeight ? this.content.h4.fontWeight : 'bold',
                '--h4-textAlign': this.content.h4 && this.content.h4.textAlign ? this.content.h4.textAlign : 'left',
                '--h4-color': this.content.h4 && this.content.h4.color ? this.content.h4.color : '#000',
                '--h4-lineHeight': this.content.h4 && this.content.h4.lineHeight ? this.content.h4.lineHeight : '1.2',
                '--h4-margin-top': this.content.h4 && this.content.h4.marginTop ? this.content.h4.marginTop : '16px',
                '--h4-margin-bottom': this.content.h4 && this.content.h4.marginBottom ? this.content.h4.marginBottom : '8px',
                // H5
                '--h5-fontSize': this.content.h5 && this.content.h5.fontSize ? this.content.h5.fontSize : '16px',
                '--h5-fontFamily': this.content.h5 && this.content.h5.fontFamily ? this.content.h5.fontFamily : '',
                '--h5-fontWeight': this.content.h5 && this.content.h5.fontWeight ? this.content.h5.fontWeight : 'bold',
                '--h5-textAlign': this.content.h5 && this.content.h5.textAlign ? this.content.h5.textAlign : 'left',
                '--h5-color': this.content.h5 && this.content.h5.color ? this.content.h5.color : '#000',
                '--h5-lineHeight': this.content.h5 && this.content.h5.lineHeight ? this.content.h5.lineHeight : '1.2',
                '--h5-margin-top': this.content.h5 && this.content.h5.marginTop ? this.content.h5.marginTop : '16px',
                '--h5-margin-bottom': this.content.h5 && this.content.h5.marginBottom ? this.content.h5.marginBottom : '8px',
                // H6
                '--h6-fontSize': this.content.h6 && this.content.h6.fontSize ? this.content.h6.fontSize : '14px',
                '--h6-fontFamily': this.content.h6 && this.content.h6.fontFamily ? this.content.h6.fontFamily : '',
                '--h6-fontWeight': this.content.h6 && this.content.h6.fontWeight ? this.content.h6.fontWeight : 'bold',
                '--h6-textAlign': this.content.h6 && this.content.h6.textAlign ? this.content.h6.textAlign : 'left',
                '--h6-color': this.content.h6 && this.content.h6.color ? this.content.h6.color : '#000',
                '--h6-lineHeight': this.content.h6 && this.content.h6.lineHeight ? this.content.h6.lineHeight : '1.2',
                '--h6-margin-top': this.content.h6 && this.content.h6.marginTop ? this.content.h6.marginTop : '16px',
                '--h6-margin-bottom': this.content.h6 && this.content.h6.marginBottom ? this.content.h6.marginBottom : '8px',
                // p
                '--p-fontSize': this.content.p && this.content.p.fontSize ? this.content.p.fontSize : '16px',
                '--p-fontFamily': this.content.p && this.content.p.fontFamily ? this.content.p.fontFamily : '',
                '--p-fontWeight': this.content.p && this.content.p.fontWeight ? this.content.p.fontWeight : 'normal',
                '--p-textAlign': this.content.p && this.content.p.textAlign ? this.content.p.textAlign : 'left',
                '--p-color': this.content.p && this.content.p.color ? this.content.p.color : '#000',
                '--p-lineHeight': this.content.p && this.content.p.lineHeight ? this.content.p.lineHeight : '1.5',
                '--p-margin-top': this.content.p && this.content.p.marginTop ? this.content.p.marginTop : '8px',
                '--p-margin-bottom': this.content.p && this.content.p.marginBottom ? this.content.p.marginBottom : '8px',
                // mention
                '--mention-fontSize': this.content.mention && this.content.mention.fontSize ? this.content.mention.fontSize : '16px',
                '--mention-fontFamily': this.content.mention && this.content.mention.fontFamily ? this.content.mention.fontFamily : '',
                '--mention-fontWeight': this.content.mention && this.content.mention.fontWeight ? this.content.mention.fontWeight : '',
                '--mention-color': this.content.mention && this.content.mention.color ? this.content.mention.color : '',
                '--mention-borderSize': this.content.mention && this.content.mention.borderSize ? this.content.mention.borderSize : '1px',
                '--mention-border-radius': this.content.mention && this.content.mention.borderRadius ? this.content.mention.borderRadius : '4px',
                // var
                '--var-fontSize': this.content.var && this.content.var.fontSize ? this.content.var.fontSize : '16px',
                '--var-fontFamily': this.content.var && this.content.var.fontFamily ? this.content.var.fontFamily : '',
                '--var-fontWeight': this.content.var && this.content.var.fontWeight ? this.content.var.fontWeight : '',
                '--var-color': this.content.var && this.content.var.color ? this.content.var.color : '',
                '--var-borderSize': this.content.var && this.content.var.borderSize ? this.content.var.borderSize : '1px',
                '--var-borderRadius': this.content.var && this.content.var.borderRadius ? this.content.var.borderRadius : '4px',
                '--var-borderColor': this.content.var && this.content.var.borderColor ? this.content.var.borderColor : '#cccccc',
                '--var-backgroundColor': this.content.var && this.content.var.backgroundColor ? this.content.var.backgroundColor : 'rgba(0, 0, 0, 0.05)',
                '--var-padding': this.content.var && this.content.var.padding ? this.content.var.padding : '3px',
                // a
                '--a-fontSize': this.content.a && this.content.a.fontSize ? this.content.a.fontSize : '16px',
                '--a-fontFamily': this.content.a && this.content.a.fontFamily ? this.content.a.fontFamily : '',
                '--a-fontWeight': this.content.a && this.content.a.fontWeight ? this.content.a.fontWeight : '',
                '--a-textAlign': this.content.a && this.content.a.textAlign ? this.content.a.textAlign : '',
                '--a-color': this.content.a && this.content.a.color ? this.content.a.color : '',
                '--a-lineHeight': this.content.a && this.content.a.lineHeight ? this.content.a.lineHeight : '',
                '--a-underline': this.content.a && this.content.a.isUnderline ? 'underline' : 'none',
                // blockquote
                '--blockquote-color': this.content.blockquote && this.content.blockquote.color ? this.content.blockquote.color : '',
                '--blockquote-border-color': this.content.blockquote && this.content.blockquote.borderColor ? this.content.blockquote.borderColor : '',
                '--blockquote-margin-top': this.content.blockquote && this.content.blockquote.marginTop ? this.content.blockquote.marginTop : '',
                '--blockquote-margin-bottom': this.content.blockquote && this.content.blockquote.marginBottom ? this.content.blockquote.marginBottom : '',
                // ul
                '--ul-margin-top': this.content.ul && this.content.ul.marginTop ? this.content.ul.marginTop : '',
                '--ul-margin-bottom': this.content.ul && this.content.ul.marginBottom ? this.content.ul.marginBottom : '',
                '--ul-item-margin-top': this.content.ul && this.content.ul.itemMarginTop ? this.content.ul.itemMarginTop : '',
                '--ul-item-margin-bottom': this.content.ul && this.content.ul.itemMarginBottom ? this.content.ul.itemMarginBottom : '',
                // ol
                '--ol-margin-top': this.content.ol && this.content.ol.marginTop ? this.content.ol.marginTop : '',
                '--ol-margin-bottom': this.content.ol && this.content.ol.marginBottom ? this.content.ol.marginBottom : '',
                '--ol-item-margin-top': this.content.ol && this.content.ol.itemMarginTop ? this.content.ol.itemMarginTop : '',
                '--ol-item-margin-bottom': this.content.ol && this.content.ol.itemMarginBottom ? this.content.ol.itemMarginBottom : '',
                // hr
                '--hr-margin-top': this.content.hr && this.content.hr.marginTop ? this.content.hr.marginTop : '',
                '--hr-margin-bottom': this.content.hr && this.content.hr.marginBottom ? this.content.hr.marginBottom : '',
                '--hr-border-style': this.content.hr && this.content.hr.borderStyle ? this.content.hr.borderStyle : '',
                '--hr-border-color': this.content.hr && this.content.hr.borderColor ? this.content.hr.borderColor : '',
                '--hr-border-width': this.content.hr && this.content.hr.borderWidth ? this.content.hr.borderWidth : '',
                // code
                '--code-color': this.content.code && this.content.code.color ? this.content.code.color : '',
                '--code-bg-color': this.content.code && this.content.code.bgColor ? this.content.code.bgColor : '',
                '--code-border-radius': this.content.code && this.content.code.borderRadius ? this.content.code.borderRadius : '',
                '--code-padding-y': this.content.code && this.content.code.paddingY ? this.content.code.paddingY : '',
                '--code-padding-x': this.content.code && this.content.code.paddingX ? this.content.code.paddingX : '',
                '--code-font-size': this.content.code && this.content.code.fontSize ? this.content.code.fontSize : '',
                // img
                '--img-max-width': this.content.img?.maxWidth,
                '--img-max-height': this.content.img?.maxHeight,
                // checkbox
                '--checkbox-color': this.content.checkbox?.color,
                // table
                '--table-border-color': this.content.table && this.content.table.borderColor ? this.content.table.borderColor : '#C7C7C7',
                '--table-border-width': this.content.table && this.content.table.borderWidth ? this.content.table.borderWidth : '1px',
                '--table-header-bg-color': this.content.table && this.content.table.headerBgColor ? this.content.table.headerBgColor : '#f5f5f5',
                '--table-pair-cell-bg-color': this.content.table && this.content.table.pairCellBgColor ? this.content.table.pairCellBgColor : '#fff',
                '--table-odd-cell-bg-color': this.content.table && this.content.table.oddCellBgColor ? this.content.table.oddCellBgColor : '#FDFDFD',
                '--table-cell-color': this.content.table && this.content.table.cellColor ? this.content.table.cellColor : '#000',
                '--table-cell-padding-x': this.content.table && this.content.table.cellPaddingX ? this.content.table.cellPaddingX : '8px',
                '--table-cell-padding-y': this.content.table && this.content.table.cellPaddingY ? this.content.table.cellPaddingY : '6px',
            };
        },
        delay() {
            return wwLib.wwUtils.getLengthUnit(this.content.debounceDelay)[0];
        },
    },
    methods: {
        loadEditor() {
            if (this.loading) return;
            this.loading = true;
            if (this.richEditor) {
                this.richEditor.setOptions({
                    editable: this.isEditable || this.wwEditorState?.isEditing,
                    editorProps: {
                        attributes: {
                            placeholder: wwLib.wwLang.getText(this.content.placeholder)
                        }
                    }
                });
                this.loading = false;
                return;
            }

            this.richEditor = new Editor({
                content: String(this.content.initialValue || ''),
                editable: true,
                autofocus: true, // Forçando autofocus para garantir que o editor receba foco
                extensions: [
                    StarterKit.configure({
                        history: true,
                        dropcursor: true,
                        gapcursor: true,
                        paragraph: {
                            HTMLAttributes: {
                                class: '',
                            },
                        },
                        code: {
                            HTMLAttributes: {
                                class: '',
                            },
                        },
                    }),
                    Underline,
                    Link.configure({
                        openOnClick: false,
                        linkOnPaste: true,
                        HTMLAttributes: {
                            target: this.content.targetBlank ? '_blank' : null,
                        },
                    }),
                    Color,
                    Subscript,
                    Superscript,
                    TextStyle,
                    Highlight,
                    FontFamily,
                    TextAlign.configure({
                        types: ['heading', 'paragraph'],
                    }),
                    CodeBlock,
                    Mention.configure(this.editorConfig.mention),
                    Var,
                    VarAutoDetect,
                ],
                onCreate: () => {
                    this.setValue(this.getContent());
                    this.setMentions(this.richEditor.getJSON().content.reduce(extractMentions, []));
                },
                onUpdate: () => {
                    this.handleOnUpdate();
                    
                    // Verifica variáveis a cada atualização do conteúdo
                    this.normalizarVariaveis();
                },
                onSelectionUpdate: ({ editor }) => {
                    this.currentSelectionEmpty = editor.state.selection.empty;
                    
                    // Allow us to hide the bubble menu when the selection is empty
                    if (editor.state.selection.empty) {
                        this.currentSelection = null;
                        this.limparSelecao();
                    } else {
                        this.currentSelection = editor.state.selection;
                        this.capturarSelecao(editor);
                    }
                },
                handleDOMEvents: {
                    focus: () => this.$emit('trigger-event', { name: 'focus', event: { value: this.getContent() } }),
                    blur: () => this.$emit('trigger-event', { name: 'blur', event: { value: this.getContent() } }),
                    mouseup: () => {
                        if (this.richEditor && !this.richEditor.state.selection.empty) {
                            this.capturarSelecao(this.richEditor);
                        }
                    },
                },
                parseOptions: {
                    preserveWhitespace: false,
                },
            });
            
            this.loading = false;
            
            // Força o foco no editor após carregar
            setTimeout(() => {
                this.richEditor.commands.focus();
            }, 100);
        },
        handleOnUpdate() {
            const htmlValue = this.richEditor.getHTML();
            if (!htmlValue) return;
            
            const currentDoc = this.richEditor.view.state.doc;
            
            // Verificar todos os nós que contêm a tag <var>
            this.richEditor.view.state.doc.descendants((node, pos) => {
                if (node.type.name === 'var') {
                    // Obter o texto dentro da tag <var>
                    const varContent = currentDoc.textBetween(pos, pos + node.nodeSize, '');
                    
                    // Verificar se o texto está no formato {{texto}}
                    if (!(varContent.startsWith('{{') && varContent.endsWith('}}'))) {
                        // Se não estiver no formato correto, remover a tag <var>
                        this.richEditor.chain()
                            .setTextSelection({ from: pos, to: pos + node.nodeSize })
                            .unsetVar()
                            .run();
                    } else {
                        // Se estiver no formato correto, verificar se tem underscores
                        // e substitui-los por hífens
                        if (varContent.includes('_')) {
                            const textoSemChaves = varContent.substring(2, varContent.length - 2);
                            const textoLimpo = textoSemChaves.replace(/[_]+/g, '-');
                            
                            if (textoSemChaves !== textoLimpo) {
                                // Substitui o conteúdo com underscores por hífens
                                this.richEditor.chain()
                                    .setTextSelection({ from: pos, to: pos + node.nodeSize })
                                    .deleteSelection()
                                    .insertContent(`<var>{{${textoLimpo}}}</var>`)
                                    .run();
                            }
                        }
                    }
                }
                return true;
            });
            
            // Formatar qualquer {{texto}} que não tenha a tag <var>
            const htmlString = htmlValue.toString();
            const varPattern = /\{\{([^{}]+)\}\}/g;
            let match;
            
            while ((match = varPattern.exec(htmlString)) !== null) {
                const fullMatch = match[0]; // {{texto}}
                const textInside = match[1]; // texto
                
                // Verificar se esse texto já está dentro de uma tag <var>
                const isInsideVarTag = htmlString.indexOf(`<var>${fullMatch}</var>`) !== -1;
                
                if (!isInsideVarTag) {
                    // Limpar e formatar o texto conforme as regras (substituir espaços e _ por -)
                    let textoProcessado = textInside;
                    
                    // Se não tiver {{, envolve o texto com {{}}
                    if (!textoProcessado.includes('{{')) {
                        // Substituir espaços por traços
                        textoProcessado = textoProcessado.replace(/\s+/g, '-');
                        
                        // Inserir o conteúdo com chaves e posicionar o cursor após a variável inserida
                        this.richEditor.chain()
                            .focus()
                            .deleteSelection()
                            .insertContent(`{{${textoProcessado}}}`)
                            .run();
                    } else {
                        // Se já está entre chaves, só garantir que espaços são substituídos por traços
                        const textoSemChaves = textoProcessado.substring(2, textoProcessado.length - 2);
                        const textoLimpo = textoSemChaves.replace(/\s+/g, '-');
                        
                        this.richEditor.chain()
                            .focus()
                            .deleteSelection()
                            .insertContent(`{{${textoLimpo}}}`)
                            .run();
                        
                        textoProcessado = textoLimpo;
                    }
                }
            }
            
            this.extractVariables(htmlValue);
            
            if (this.content.debounce) {
                this.isDebouncing = true;
                if (this.debounce) {
                    clearTimeout(this.debounce);
                }
                this.debounce = setTimeout(() => {
                    this.$emit('trigger-event', { name: 'change', event: { value: this.variableValue } });
                    this.isDebouncing = false;
                }, this.delay);
            } else {
                this.$emit('trigger-event', { name: 'change', event: { value: this.variableValue } });
            }
            this.setMentions(this.richEditor.getJSON().content.reduce(extractMentions, []));
            
            // Forçar a normalização de variáveis após qualquer atualização
            this.normalizarVariaveis();
        },
        setLink(url) {
            if (this.richEditor.isActive('link')) {
                this.richEditor.chain().focus().unsetLink().run();
                return;
            }

            const previousUrl = this.richEditor.getAttributes('link').href;
            const selectedUrl = url ?? window.prompt('URL', previousUrl);

            // cancelled
            if (selectedUrl === null) {
                return;
            }

            // empty
            if (selectedUrl === '') {
                this.richEditor.chain().focus().extendMarkRange('link').unsetLink().run();

                return;
            }

            // update link
            this.richEditor.chain().focus().extendMarkRange('link').setLink({ href: selectedUrl }).run();
        },
        setImage(src, alt = '', title = '') {
            if (this.content.customMenu) this.richEditor.commands.setImage({ src, alt, title });
            else {
                let url;
                /* wwEditor:start */
                url = wwLib.getEditorWindow().prompt('Image URL');
                /* wwEditor:end */
                /* wwFront:start */
                url = wwLib.getFrontWindow().prompt('Image URL');
                /* wwFront:end */

                if (!url) return;
                this.richEditor.chain().focus().setImage({ src: url }).run();
            }
        },
        focusEditor() {
            this.richEditor.chain().focus().run();
        },
        setTag(tag) {
            if (typeof tag === 'string') {
                tag = tag.toLocaleLowerCase().trim();
                if (tag in TAGS_MAP) tag = TAGS_MAP[tag];
            }
            if (tag === 0) this.richEditor.chain().focus().setParagraph().run();
            if (tag !== 0)
                this.richEditor
                    .chain()
                    .focus()
                    .toggleHeading({ level: Number(tag) })
                    .run();
        },
        toggleBold() {
            this.richEditor.chain().focus().toggleBold().run();
        },
        toggleItalic() {
            this.richEditor.chain().focus().toggleItalic().run();
        },
        toggleStrike() {
            this.richEditor.chain().focus().toggleStrike().run();
        },
        setTextAlign(textAlign) {
            this.richEditor.chain().focus().setTextAlign(textAlign).run();
        },
        setColor(color) {
            this.richEditor.chain().focus().setColor(color).run();
        },
        toggleBulletList() {
            this.richEditor.chain().focus().toggleBulletList().run();
        },
        toggleOrderedList() {
            this.richEditor.chain().focus().toggleOrderedList().run();
        },
        toggleTaskList() {
            this.richEditor.chain().focus().toggleTaskList().run();
        },
        toggleCodeBlock() {
            this.richEditor.chain().focus().toggleCodeBlock().run();
        },
        toggleBlockquote() {
            this.richEditor.chain().focus().toggleBlockquote().run();
        },
        toggleVar() {
            if (!this.richEditor) {
                return;
            }

            // Obtém o texto selecionado atualmente
            const { state } = this.richEditor;
            const { from, to } = state.selection;
            const selectedText = state.doc.textBetween(from, to, '');
            
            // Verifica se há texto selecionado
            if (selectedText.length > 0) {
                // Função para normalizar caracteres (remover acentos e caracteres especiais)
                const normalizarTexto = (texto) => {
                    // Remover acentos e caracteres especiais
                    const semAcentos = texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                    // Converter para minúsculas e substituir caracteres não alfanuméricos por hífens
                    return semAcentos.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
                };
                
                // Verifica se o texto já está no formato {{texto}}
                if (selectedText.startsWith('{{') && selectedText.endsWith('}}')) {
                    // Apenas aplica a tag var
                    this.richEditor.chain().focus().toggleVar().run();
                } else {
                    // Normaliza o texto selecionado (remove acentos e substitui caracteres especiais)
                    const textoNormalizado = normalizarTexto(selectedText);
                    
                    // Envolve o texto normalizado com {{}}
                    const formattedText = '{{' + textoNormalizado + '}}';
                    
                    // Substitui o texto selecionado pelo texto formatado
                    this.richEditor.chain()
                        .focus()
                        .deleteSelection()
                        .insertContent(formattedText)
                        .setTextSelection({
                            from: from,
                            to: from + formattedText.length
                        })
                        .run();
                    
                    // Aplica a tag var ao novo texto
                    this.richEditor.chain()
                        .focus()
                        .toggleVar()
                        .run();
                }
            } else {
                // Se não houver texto selecionado, apenas aplica a tag var
                this.richEditor.chain().focus().toggleVar().run();
            }
        },
        toggleUnderline() {
            this.richEditor.chain().focus().toggleMark('underline').run();
        },
        undo() {
            this.richEditor.chain().undo().run();
        },
        redo() {
            this.richEditor.chain().redo().run();
        },
        getContent() {
            if (this.content.output === 'markdown') return this.richEditor.storage.markdown.getMarkdown();
            return this.richEditor.getHTML();
        },
        /* Table */
        insertTable() {
            this.richEditor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
        },
        insertRow(direction) {
            direction === 'before'
                ? this.richEditor.chain().focus().addRowBefore().run()
                : this.richEditor.chain().focus().addRowAfter().run();
        },
        insertColumn(direction) {
            direction === 'before'
                ? this.richEditor.chain().focus().addColumnBefore().run()
                : this.richEditor.chain().focus().addColumnAfter().run();
        },
        deleteRow() {
            this.richEditor.chain().focus().deleteRow().run();
        },
        deleteColumn() {
            this.richEditor.chain().focus().deleteColumn().run();
        },
        deleteTable() {
            this.richEditor.chain().focus().deleteTable().run();
        },
        initContent(newContent) {
            this.richEditor.commands.setContent(newContent);
        },
        extractVariables(htmlContent) {
            if (!htmlContent || typeof htmlContent !== 'string') return;
            
            // Função para normalizar variáveis
            const normalizeVar = (rawVar) => {
                // Remover acentos e caracteres especiais
                const semAcentos = rawVar.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                // Converter para minúsculas e substituir caracteres não alfanuméricos por hífens
                return semAcentos.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
            };

            // Nova função para extrair variáveis com segurança, evitando problemas com chaves aninhadas
            const extrairVariaveis = (texto) => {
                const resultado = [];
                let i = 0;
                
                while (i < texto.length - 1) {
                    // Procura pelo início de uma variável
                    if (texto[i] === '{' && texto[i+1] === '{') {
                        const inicioVar = i;
                        i += 2; // Pula as chaves de abertura
                        
                        // Procura pelo fim da variável atual
                        let fimVar = -1;
                        while (i < texto.length - 1) {
                            if (texto[i] === '}' && texto[i+1] === '}') {
                                fimVar = i;
                                break;
                            }
                            
                            // Se encontrar outra abertura de variável antes do fechamento,
                            // significa que a variável atual não é válida
                            if (texto[i] === '{' && texto[i+1] === '{') {
                                // Variável inválida, abandonamos esta busca
                                fimVar = -1;
                                break;
                            }
                            
                            i++;
                        }
                        
                        // Se encontrou um fechamento válido
                        if (fimVar !== -1) {
                            const conteudoVar = texto.substring(inicioVar + 2, fimVar);
                            resultado.push({
                                variavel: `{{${conteudoVar}}}`,
                                conteudo: conteudoVar
                            });
                            i = fimVar + 2; // Avança para depois do fechamento
                        } else {
                            // Se não encontrou fechamento, avança apenas um caractere
                            i = inicioVar + 1;
                        }
                    } else {
                        i++;
                    }
                }
                
                return resultado;
            };
            
            // Extrai todas as variáveis do conteúdo
            const variaveisEncontradas = extrairVariaveis(htmlContent);
            
            // Dicionário para guardar as variáveis normalizadas
            const dictionary = {};
            const order = [];
            
            // Processa cada variável encontrada
            variaveisEncontradas.forEach((item) => {
                const normalizado = normalizeVar(item.conteudo);
                const varStr = `{{${normalizado}}}`;
                
                if (!dictionary[varStr]) {
                    dictionary[varStr] = {
                        tipo: "text",
                        value: null,
                        requerid: false,
                        variavel: varStr,
                        inputNome: null,
                        repetido: 1
                    };
                    order.push(varStr);
                } else {
                    dictionary[varStr].repetido++;
                }
            });
            
            // Formata o resultado 
            const resultado = order.map((key) => {
                return {
                    ...dictionary[key],
                    repetido: dictionary[key].repetido.toString()
                };
            });

            // Cria um array com as variáveis extraídas (no formato similar a mentions)
            const variablesArray = order.map((key, index) => {
                const item = dictionary[key];
                const name = item.variavel.replace(/[{}]/g, '');
                return {
                    id: index + 1, // ID numérico e automático, começando em 1
                    name: name,
                    tipo: item.tipo,
                    value: item.value,
                    required: item.requerid,
                    variavel: item.variavel,
                    inputNome: item.inputNome,
                    repetido: item.repetido.toString()
                };
            });

            // Atualiza a variável nativa 'variables'
            this.setVariables(variablesArray);

            // Atualiza a propriedade inputsForm, se estiver definida
            if (this.content.inputsForm) {
                this.$emit('update:content', {
                    ...this.content,
                    inputsForm: resultado
                });
            }
        },
        capturarSelecao(editor) {
            try {
                if (!editor || !editor.state.selection) {
                    return;
                }
                
                // Verificar se realmente temos uma seleção
                if (editor.state.selection.empty) {
                    this.limparSelecao();
                    return;
                }
                
                // Capturar o texto selecionado
                const textoSelecionado = editor.state.doc.textBetween(
                    editor.state.selection.from,
                    editor.state.selection.to,
                    ' '
                );
                
                // Se não houver texto, não continuar
                if (!textoSelecionado.trim()) {
                    this.limparSelecao();
                    return;
                }
                
                // Obter a posição da seleção para o menu
                const selecaoDOM = document.getSelection();
                
                if (selecaoDOM && selecaoDOM.rangeCount > 0) {
                    const range = selecaoDOM.getRangeAt(0);
                    const rect = range.getBoundingClientRect();
                    
                    // Calcular a posição relativa ao editor
                    const editorEl = this.$el.querySelector('.rich-editor');
                    const editorRect = editorEl ? editorEl.getBoundingClientRect() : { left: 0, top: 0 };
                    
                    // Informações sobre a seleção
                    const selecaoInfo = {
                        ativo: true,
                        posicao: {
                            x: rect.left - editorRect.left + (rect.width / 2),
                            y: rect.top - editorRect.top,
                            largura: rect.width,
                            altura: rect.height
                        }
                    };
                    
                    // Atualizar variáveis do componente
                    this.setTextoSelecionado(textoSelecionado);
                    this.setSelecaoInfo(selecaoInfo);
                    
                    // Armazenar a seleção para uso futuro (isso ajuda a manter a seleção mesmo quando o usuário clica fora)
                    this.ultimaSelecao = {
                        from: editor.state.selection.from,
                        to: editor.state.selection.to,
                        texto: textoSelecionado,
                        info: selecaoInfo
                    };
                    
                    console.log('Texto selecionado:', textoSelecionado);
                }
            } catch (error) {
                console.error('Erro ao capturar seleção:', error);
                this.limparSelecao();
            }
        },
        limparSelecao() {
            // Verificar se há uma última seleção armazenada
            if (this.ultimaSelecao && this.ultimaSelecao.texto) {
                // Manter o texto selecionado por um momento antes de limpar
                // Isso permite que ações acionadas imediatamente após a seleção ainda acessem o texto
                setTimeout(() => {
                    // Atualizar as variáveis oficiais do componente
                    this.setTextoSelecionado('');
                    this.setSelecaoInfo({
                        ativo: false,
                        posicao: {
                            x: 0,
                            y: 0,
                            largura: 0,
                            altura: 0
                        }
                    });
                    // Limpar a última seleção após um período
                    this.ultimaSelecao = null;
                }, 150); // Pequeno atraso para permitir que ações usem a seleção
            } else {
                // Se não houver última seleção, limpar imediatamente
                this.setTextoSelecionado('');
                this.setSelecaoInfo({
                    ativo: false,
                    posicao: {
                        x: 0,
                        y: 0,
                        largura: 0,
                        altura: 0
                    }
                });
            }
        },
        criarVariavel(params = {}) {
            try {
                const textoSelecionado = params.texto || (this.textoSelecionado || '').toString();
                
                if (!textoSelecionado || textoSelecionado.length === 0) {
                    console.warn('Nenhum texto selecionado para criar variável');
                    return false;
                }
                
                // Função para normalizar caracteres (remover acentos e substituir espaços por traços)
                const normalizarTexto = (texto) => {
                    // Remover acentos e caracteres especiais
                    const semAcentos = texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                    // Substituir espaços e caracteres especiais por traços
                    return semAcentos.toLowerCase().trim().replace(/[^a-zA-Z0-9]+/g, '-');
                };
                
                // Processar o texto antes de inseri-lo
                let textoProcessado = textoSelecionado;
                
                // Se não tiver {{, envolve o texto com {{}}
                if (!textoProcessado.includes('{{')) {
                    // Normalizar o texto (remover acentos e substituir espaços por traços)
                    textoProcessado = normalizarTexto(textoProcessado).toLowerCase();
                    
                    // Inserir o conteúdo com chaves e posicionar o cursor após a variável inserida
                    this.richEditor.chain()
                        .focus()
                        .deleteSelection()
                        .insertContent(`{{${textoProcessado}}}`)
                        .run();
                } else {
                    // Se já está entre chaves, só garantir que o texto está normalizado
                    const textoSemChaves = textoProcessado.substring(2, textoProcessado.length - 2);
                    const textoLimpo = normalizarTexto(textoSemChaves).toLowerCase();
                    
                    this.richEditor.chain()
                        .focus()
                        .deleteSelection()
                        .insertContent(`{{${textoLimpo}}}`)
                        .run();
                    
                    textoProcessado = textoLimpo;
                }
                
                // Força o foco no editor e posicionar o cursor logo após a variável inserida
                setTimeout(() => {
                    this.richEditor.commands.focus();
                    
                    // Determinar a posição atual do cursor
                    const { selection } = this.richEditor.state;
                    if (!selection.empty) {
                        // Se houver uma seleção, move o cursor para o final dela
                        this.richEditor.commands.setTextSelection(selection.to);
                    }
                }, 10);
                
                // Atualizar a lista de variáveis após um pequeno atraso para garantir
                // que o conteúdo foi atualizado corretamente
                setTimeout(() => {
                    // Atualizar a lista de variáveis
                    const novasVariaveis = this.extractVariables(this.getContent());
                    this.setVariables(novasVariaveis);
                    
                    // Normatizar as variáveis para garantir consistência
                    this.normalizarVariaveis();
                }, 50);
                
                // Emitir evento de sucesso
                this.$emit('trigger-event', { 
                    name: 'variable:created', 
                    event: { 
                        text: textoProcessado
                    } 
                });
                
                console.log(`Variável criada com sucesso!`);
                return true;
            } catch (error) {
                console.error('Erro ao criar variável:', error);
                return false;
            }
        },
        replaceText(originalText, replacementText) {
            if (!this.richEditor || !originalText) return;
            
            // Obter o conteúdo atual do editor
            const conteudoAtual = this.richEditor.getHTML();
            
            // Realiza a substituição
            const novoConteudo = conteudoAtual.replace(new RegExp(originalText, 'g'), replacementText);
            
            // Atualiza o conteúdo do editor
            this.richEditor.commands.setContent(novoConteudo);
            
            // Emite evento de alteração
            this.$emit('update:content', { text: this.extractVariables(novoConteudo) });
            this.$emit('trigger-change', { value: this.richEditor.getHTML() });
        },
        handleGlobalPaste(event) {
            // Verificar se o editor está em foco e se deve processar o evento
            if (!this.richEditor || !this.$el.contains(event.target)) {
                return;
            }
            
            // Permitimos que o TipTap processe a colagem normalmente
            // Mas capturamos o evento para processar após a colagem ser concluída
            
            // Interceptamos o evento apenas para poder limpar formatações específicas
            // após a colagem ser processada pelo TipTap
            const html = event.clipboardData?.getData('text/html');
            
            if (html) {
                // Evitamos a duplicação não inserindo conteúdo manualmente
                // Apenas aguardamos o processamento interno e depois limpamos formatações
                
                // Usamos setTimeout para garantir que o conteúdo já foi inserido
                // pelo TipTap antes de tentarmos limpar as formatações
                setTimeout(() => {
                    this.limparFormatacoesDaColagem();
                }, 0);
            }
        },
        
        // Nova função para limpar formatações após colagem
        limparFormatacoesDaColagem() {
            if (!this.richEditor) return;
            
            // Salvamos a seleção atual para restaurar depois
            const { state } = this.richEditor.view;
            const selecao = { from: state.selection.from, to: state.selection.to };
            
            try {
                // Obtem o HTML atual
                const htmlAtual = this.richEditor.getHTML();
                
                // Cria um elemento temporário para manipular o HTML
                const div = document.createElement('div');
                div.innerHTML = htmlAtual;
                
                // Função para remover atributos e estilos relacionados a fontes
                const removerFormatacaoFonte = (elemento) => {
                    if (!elemento) return;
                    
                    // Remover atributos de estilo de fonte
                    if (elemento.style) {
                        elemento.style.fontFamily = '';
                        elemento.style.fontSize = '';
                        elemento.style.font = '';
                    }
                    
                    // Remover atributos relacionados a fonte
                    const atributosParaRemover = [
                        'face', 'size', 'font', 'data-font', 'data-size'
                    ];
                    
                    atributosParaRemover.forEach(attr => {
                        if (elemento.hasAttribute(attr)) {
                            elemento.removeAttribute(attr);
                        }
                    });
                    
                    // Remover classes que possam conter formatação de fonte
                    if (elemento.classList) {
                        const classesParaRemover = [];
                        elemento.classList.forEach(className => {
                            if (className.includes('font') || className.includes('text-size')) {
                                classesParaRemover.push(className);
                            }
                        });
                        
                        classesParaRemover.forEach(className => {
                            elemento.classList.remove(className);
                        });
                    }
                    
                    // Processar filhos recursivamente
                    Array.from(elemento.children || []).forEach(removerFormatacaoFonte);
                };
                
                // Processar todos os elementos para remover formatações
                removerFormatacaoFonte(div);
                
                // Converter tags específicas com estilos de fonte
                const seletoresTagsParaProcessar = 'font, span[style*="font"], *[style*="font-family"], *[style*="font-size"]';
                const tagsParaProcessar = div.querySelectorAll(seletoresTagsParaProcessar);
                
                tagsParaProcessar.forEach(tag => {
                    if (tag.style) {
                        tag.style.fontFamily = '';
                        tag.style.fontSize = '';
                        tag.style.font = '';
                    }
                    
                    // Para tags <font>, repassamos o conteúdo para um span neutro
                    if (tag.tagName.toLowerCase() === 'font') {
                        const span = document.createElement('span');
                        span.innerHTML = tag.innerHTML;
                        
                        if (tag.parentNode) {
                            tag.parentNode.replaceChild(span, tag);
                        }
                    }
                });
                
                // Simplificar a estrutura para remover elementos vazios ou redundantes
                const simplificarElementos = (elemento) => {
                    if (!elemento || !elemento.children || elemento.children.length === 0) return;
                    
                    Array.from(elemento.children).forEach(filho => {
                        // Recursivamente simplifica os filhos primeiro
                        simplificarElementos(filho);
                        
                        // Remove spans vazios ou sem atributos aninhados
                        if (filho.tagName.toLowerCase() === 'span' && 
                            (!filho.attributes.length || filho.attributes.length === 0) && 
                            ['span', 'p', 'div'].includes(elemento.tagName.toLowerCase())) {
                            
                            // Mover o conteúdo do filho para o pai
                            while (filho.firstChild) {
                                elemento.insertBefore(filho.firstChild, filho);
                            }
                            
                            // Remover o filho vazio
                            elemento.removeChild(filho);
                        }
                    });
                };
                
                // Simplificar a estrutura HTML
                simplificarElementos(div);
                
                // Obter o HTML limpo e configurar no editor
                const htmlLimpo = div.innerHTML;
                
                // Verificar se houve alteração no HTML para evitar loops
                if (htmlLimpo !== htmlAtual) {
                    // Atualizar o conteúdo do editor com o HTML limpo
                    this.richEditor.commands.setContent(htmlLimpo);
                    
                    // Tentar restaurar a seleção se possível
                    try {
                        this.richEditor.commands.setTextSelection(selecao);
                    } catch (e) {
                        console.warn('Não foi possível restaurar a seleção após limpeza:', e);
                    }
                }
            } catch (error) {
                console.error('Erro ao limpar formatações após colagem:', error);
            }
        },
        normalizarVariaveis() {
            if (!this.richEditor) return;
            
            // Verificar e modificar o conteúdo HTML diretamente
            const conteudoAtual = this.richEditor.getHTML();
            
            // Regex para encontrar todas as variáveis no formato {{texto}} ou <var>{{texto}}</var>
            const regexVariaveis = /<var>\{\{([^{}]+)\}\}<\/var>|\{\{([^{}]+)\}\}/g;
            
            let conteudoModificado = conteudoAtual;
            let match;
            let foiModificado = false;
            
            // Função auxiliar para limpar e formatar o texto da variável
            // Usamos a mesma lógica de normalizeVar na função extractVariables
            const formatarTextoVariavel = (texto) => {
                // Remover acentos e caracteres especiais
                const semAcentos = texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                // Converter para minúsculas e substituir caracteres não alfanuméricos por hífens
                return semAcentos.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
            };
            
            // Substituir todas as ocorrências
            while ((match = regexVariaveis.exec(conteudoAtual)) !== null) {
                const textoCompleto = match[0]; // <var>{{texto}}</var> ou {{texto}}
                const textoVariavel = match[1] || match[2]; // texto dentro das chaves
                
                // Formatamos todas as variáveis para garantir consistência
                const textoFormatado = formatarTextoVariavel(textoVariavel);
                
                // Determinar se a variável tem a tag <var>
                const temTagVar = textoCompleto.startsWith('<var>');
                
                // Criar a substituição apropriada
                const substituicao = temTagVar 
                    ? `<var>{{${textoFormatado}}}</var>` 
                    : `{{${textoFormatado}}}`;
                
                // Substituir apenas se o texto original for diferente do formatado
                if (textoFormatado !== textoVariavel) {
                    conteudoModificado = conteudoModificado.replace(textoCompleto, substituicao);
                    foiModificado = true;
                }
            }
            
            // Se houve modificações, atualizar o editor
            if (foiModificado) {
                // Salvar a posição do cursor antes da modificação
                const { state } = this.richEditor.view;
                const selecao = { from: state.selection.from, to: state.selection.to };
                
                // Atualizar o conteúdo
                this.richEditor.commands.setContent(conteudoModificado);
                
                // Tentar restaurar a posição do cursor
                this.richEditor.commands.setTextSelection(selecao);
                
                // Emitir eventos
                this.$emit('update:content', { text: this.extractVariables(conteudoModificado) });
                this.$emit('trigger-change', { value: conteudoModificado });
            }
        },
    },
    mounted() {
        this.loadEditor();
        document.addEventListener('selectionchange', this.handleSelectionChange);
        
        // Adicionar interceptador global de colagem para o documento inteiro
        document.addEventListener('paste', this.handleGlobalPaste, true);
    },
    beforeUnmount() {
        if (this.richEditor) {
            this.richEditor.destroy();
        }
        document.removeEventListener('selectionchange', this.handleSelectionChange);
        
        // Remover o interceptador global ao destruir o componente
        document.removeEventListener('paste', this.handleGlobalPaste, true);
    },
};
</script>

<style lang="scss">
.ww-rich-text-editor-component {
    --menu-color: unset;
    flex-direction: column;

    .bubble-menu-container {
        z-index: 100;
        position: relative;
    }

    &.editing .ww-rich-text-editor-component__input {
        position: relative;
        &::before {
            content: '';
            position: absolute;
            inset: 0;
            z-index: 1;
        }
    }

    &.editing .native-menu {
        position: relative;
        &::before {
            content: '';
            position: absolute;
            inset: 0;
            z-index: 1;
        }
    }

    .separator {
        background: rgb(235, 236, 240);
        width: 1px;
        height: 24px;
        margin: 0px 8px;

        &:last-child {
            display: none;
        }
    }

    &__menu {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-bottom: 4px;
        gap: 4px;
        overflow-x: auto;
        min-height: 32px;
        select {
            padding: 8px;
            appearance: none;
            border: none;
            font-weight: 700;
            cursor: pointer;
            color: var(--menu-color);
            background-color: transparent;
            &:hover {
                background-color: rgb(245, 245, 245);
            }
        }
        &-item {
            padding: 2px;
            color: var(--menu-color);
            cursor: pointer;
            text-align: center;
            border-radius: 4px;
            i {
                width: 24px;
            }
            .icon {
                color: var(--menu-color);
                display: flex;
                width: 24px;
                max-height: 16px;
            }
            &:hover {
                background-color: rgb(245, 245, 245);
            }
            &.is-active {
                color: white;
                background-color: var(--menu-color);
            }
        }
    }

    .ProseMirror {
        /* Basic editor styles */
        cursor: text;
        max-height: 100%;
        width: 100%;
        overflow: auto;
        padding: 8px;
        &-focused {
            outline: unset;
        }
        > * + * {
            margin-top: 0.75em;
        }

        /* Placeholder (at the top) */
        & p.is-editor-empty:first-child::before {
            content: attr(data-placeholder);
            float: left;
            color: #adb5bd;
            pointer-events: none;
            height: 0;
        }

        h1 {
            font-size: var(--h1-fontSize);
            font-family: var(--h1-fontFamily);
            font-weight: var(--h1-fontWeight);
            text-align: var(--h1-textAlign);
            color: var(--h1-color);
            line-height: var(--h1-lineHeight);
            margin-top: var(--h1-margin-top);
            margin-bottom: var(--h1-margin-bottom);
        }
        h2 {
            font-size: var(--h2-fontSize);
            font-family: var(--h2-fontFamily);
            font-weight: var(--h2-fontWeight);
            text-align: var(--h2-textAlign);
            color: var(--h2-color);
            line-height: var(--h2-lineHeight);
            margin-top: var(--h2-margin-top);
            margin-bottom: var(--h2-margin-bottom);
        }
        h3 {
            font-size: var(--h3-fontSize);
            font-family: var(--h3-fontFamily);
            font-weight: var(--h3-fontWeight);
            text-align: var(--h3-textAlign);
            color: var(--h3-color);
            line-height: var(--h3-lineHeight);
            margin-top: var(--h3-margin-top);
            margin-bottom: var(--h3-margin-bottom);
        }
        h4 {
            font-size: var(--h4-fontSize);
            font-family: var(--h4-fontFamily);
            font-weight: var(--h4-fontWeight);
            text-align: var(--h4-textAlign);
            color: var(--h4-color);
            line-height: var(--h4-lineHeight);
            margin-top: var(--h4-margin-top);
            margin-bottom: var(--h4-margin-bottom);
        }
        h5 {
            font-size: var(--h5-fontSize);
            font-family: var(--h5-fontFamily);
            font-weight: var(--h5-fontWeight);
            text-align: var(--h5-textAlign);
            color: var(--h5-color);
            line-height: var(--h5-lineHeight);
            margin-top: var(--h5-margin-top);
            margin-bottom: var(--h5-margin-bottom);
        }
        h6 {
            font-size: var(--h6-fontSize);
            font-family: var(--h6-fontFamily);
            font-weight: var(--h6-fontWeight);
            text-align: var(--h6-textAlign);
            color: var(--h6-color);
            line-height: var(--h6-lineHeight);
            margin-top: var(--h6-margin-top);
            margin-bottom: var(--h6-margin-bottom);
        }
        p {
            font-size: var(--p-fontSize);
            font-family: var(--p-fontFamily);
            font-weight: var(--p-fontWeight);
            text-align: var(--p-textAlign);
            color: var(--p-color);
            line-height: var(--p-lineHeight);
            margin-top: var(--p-margin-top);
            margin-bottom: var(--p-margin-bottom);
        }
        a {
            display: initial;
            text-decoration: var(--a-underline);
            font-size: var(--a-fontSize);
            font-family: var(--a-fontFamily);
            font-weight: var(--a-fontWeight);
            text-align: var(--a-textAlign);
            color: var(--a-color);
            line-height: var(--a-lineHeight);
            cursor: pointer;
        }
        font-size: var(--p-fontSize);
        font-family: var(--p-fontFamily);
        font-weight: var(--p-fontSize);
        text-align: var(--p-textAlign);
        color: var(--p-color);
        line-height: var(--p-lineHeight);

        .mention {
            border: var(--mention-borderSize) solid var(--mention-color);
            border-radius: var(--mention-border-radius);
            padding: 0.1rem 0.3rem;
            box-decoration-break: clone;
            cursor: pointer;
            font-size: var(--mention-fontSize);
            font-family: var(--mention-fontFamily);
            font-weight: var(--mention-fontSize);
            color: var(--mention-color);
        }

        var {
            font-size: var(--var-fontSize);
            font-family: var(--var-fontFamily);
            font-weight: var(--var-fontWeight);
            color: var(--var-color);
            padding: var(--var-padding);
            box-decoration-break: clone;
            border-radius: var(--var-borderRadius);
            background-color: var(--var-backgroundColor);
            font-style: normal;
            border: var(--var-borderSize) solid var(--var-borderColor);
        }

        table {
            border-collapse: collapse;
            margin: 0;
            overflow: hidden;
            display: table;
            width: 100%;

            td,
            th {
                text-align: left;
                border: var(--table-border-width) solid var(--table-border-color);
                box-sizing: border-box;
                min-width: 1em;
                padding: var(--table-cell-padding-y) var(--table-cell-padding-x);
                position: relative;
                vertical-align: top;

                > * {
                    margin-bottom: 0;
                }
            }

            th {
                color: var(--table-header-color);
                font-style: normal;
                font-weight: 500;
                font-size: 15px;
                line-height: 18px;
                letter-spacing: -0.08px;
                background-color: var(--table-header-bg-color);
            }

            td {
                background-color: var(--table-pair-cell-bg-color);
                color: var(--table-cell-color);
            }

            tr:nth-child(odd) td {
                background-color: var(--table-odd-cell-bg-color);
            }

            /*
            .selectedCell:after {
                background: blue;
                content: '';
                left: 0;
                right: 0;
                top: 0;
                bottom: 0;
                pointer-events: none;
                position: absolute;
                z-index: 2;
            }
                */

            .column-resize-handle {
                background-color: red;
                bottom: -2px;
                pointer-events: none;
                position: absolute;
                right: -2px;
                top: 0;
                width: 4px;
            }
        }

        .tableWrapper {
            margin: 1.5rem 0;
            overflow-x: auto;
        }

        &.resize-cursor {
            cursor: ew-resize;
            cursor: col-resize;
        }

        blockquote {
            color: var(--blockquote-color);
            border-left: 0.2rem solid var(--blockquote-border-color);
            margin: 1rem 0;
            padding: 0.25rem 0 0.25rem 1rem;
            margin-top: var(--blockquote-margin-top);
            margin-bottom: var(--blockquote-margin-bottom);
        }

        pre {
            background: var(--code-bg-color);
            color: var(--code-color);
            font-family: 'JetBrainsMono', monospace;
            padding: var(--code-padding-y) var(--code-padding-x);
            border-radius: var(--code-border-radius);

            code {
                color: inherit;
                padding: 0;
                background: none;
                font-size: var(--code-font-size);
            }
        }

        img {
            max-width: var(--img-max-width);
            max-height: var(--img-max-height);
        }

        ul[data-type='taskList'] {
            list-style: none;
            padding: 0;

            p {
                margin: 0;
            }

            li {
                display: flex;

                > label {
                    flex: 0 0 auto;
                    margin-right: var(--ww-spacing-01);
                    user-select: none;
                }

                > div {
                    flex: 1 1 auto;
                }

                ul li,
                ol li {
                    display: list-item;
                }

                ul[data-type='taskList'] > li {
                    display: flex;
                }

                input[type='checkbox'] {
                    cursor: pointer;
                    accent-color: var(--checkbox-color);
                }
            }
        }

        ul {
            margin-top: var(--ul-margin-top);
            margin-bottom: var(--ul-margin-bottom);
        }

        ul li {
            margin-top: var(--ul-item-margin-top);
            margin-bottom: var(--ul-item-margin-bottom);
        }

        ol {
            margin-top: var(--ol-margin-top);
            margin-bottom: var(--ol-margin-bottom);
        }

        ol li {
            margin-top: var(--ol-item-margin-top);
            margin-bottom: var(--ol-item-margin-bottom);
        }

        hr {
            margin-top: var(--hr-margin-top);
            margin-bottom: var(--hr-margin-bottom);
            border-style: var(--hr-border-style);
            border-color: var(--hr-border-color);
            border-width: var(--hr-border-width);
        }
    }

    &.-readonly .ProseMirror {
        cursor: inherit;
    }

    .mention-suggestion {
        background: white;
        border-radius: 4px;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
        overflow: hidden;
        min-width: 180px;
        max-width: 300px;
        
        .items {
            padding: 0;
            
            .item {
                display: block;
                width: 100%;
                padding: 8px 12px;
                text-align: left;
                border: none;
                background: none;
                cursor: pointer;
                
                &:hover, &.is-selected {
                    background-color: #f5f5f5;
                }
            }
        }
    }
}
</style>
