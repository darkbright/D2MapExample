CKEDITOR.plugins.add('textLarger', {
    //icons: 'textLarger',
    init: function( editor ) {
        var textControl = new CKEDITOR.textFontSizeControl({ name: 'textFontSize' }, editor)
        editor.addCommand('textLarger', {
            exec: function(edt) {
                //* CKEDITOR.config.fontSize_sizes
                let arrFontSizes = [];
                for (let i = 0; i < CKEDITOR.config.fontSize_sizes.split(';').length; i++) {
                    arrFontSizes.push(parseInt(CKEDITOR.config.fontSize_sizes.split(';')[i].split('/')[0]))
                }

                const getNewSize = (val) => {
                    let idx = arrFontSizes.indexOf(val);
                    return arrFontSizes[idx+1] === undefined ? val : arrFontSizes[idx+1];
                }

                textControl.render(edt.getSelection());
                const currentSize = textControl.getValue();
                //* case1 font-size가 없는 경우: 문자크기 기본값으로
                let size = 14; 
                //* case2 font-size가 있어서 변경하는 경우: 문자크기 옵션도 같이 변경해줘야함
                if (currentSize !== "" && currentSize !== undefined) 
                    size = parseInt(currentSize);
                const style = textControl.createStyle(getNewSize(size));
                edt.applyStyle(style);
            }
        })

        editor.ui.addButton('textLarger', {
            label: '글자 크기 크게',
            command: 'textLarger',
            toolbar: 'styles,'+ 40
        })
    },
})

CKEDITOR.textFontSizeControl = CKEDITOR.tools.createClass({
    $: function( settings, editor ) {
		this.settings = settings;
		this.editor = editor;
		this.definition = editor.config[ settings.name + '_style' ];
	},
    proto: {
		createStyle: function( size ) {
            var args = size ? { size: size } : undefined;
			return new CKEDITOR.style( this.definition, args );
		},
        getValue: function() {
            if (!this.element) return;
            if (this.element.getStartElement().$.style.fontSize === '') {
                for (let parent of this.element.getStartElement().getParents()) {
                    if (parent.$.tagName === 'SPAN' && parent.$.style.fontSize !== '') {
                        return parent.$.style.fontSize;
                    }
                }
            }
            return this.element.getStartElement().$.style.fontSize;
        },
        render: function(target) {
            this.element = target
        }
    }
})

CKEDITOR.config.textFontSize_style = {
    element: 'span',
    styles: { 'font-size': '#(size)px'},
    overrides: [{
        element: 'font',
        attributes: {'size': null},
    }],
}