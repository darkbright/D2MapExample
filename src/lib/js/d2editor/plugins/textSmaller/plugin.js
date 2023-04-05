CKEDITOR.plugins.add('textSmaller', {
    //icons: 'textSmaller',
    init: function( editor ) {
        var textControl = new CKEDITOR.textFontSizeControl({ name: 'textFontSize' }, editor) //textLarger plugin.js에 정의되어있음
        editor.addCommand('textSmaller', {
            exec: function(edt) {
                let arrFontSizes = [];
                for (let i = 0; i < CKEDITOR.config.fontSize_sizes.split(';').length; i++) {
                    arrFontSizes.push(parseInt(CKEDITOR.config.fontSize_sizes.split(';')[i].split('/')[0]))
                }

                const getNewSize = (val) => {
                    let idx = arrFontSizes.indexOf(val);
                    return arrFontSizes[idx-1] === undefined ? val : arrFontSizes[idx-1];
                }

                textControl.render(edt.getSelection());
                const currentSize = textControl.getValue();
                let size = 14; 
                if (currentSize !== "" && currentSize !== undefined) 
                    size = parseInt(currentSize);
                const style = textControl.createStyle(getNewSize(size));
                edt.applyStyle(style);
            }
        })

        editor.ui.addButton('textSmaller', {
            label: '글자 크기 작게',
            command: 'textSmaller',
            toolbar: 'styles,'+ 50
        })
    },
})

