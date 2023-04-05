CKEDITOR.plugins.add( 'simplebox', {
    // Widget Source Code
    requires: 'widget',

    icons: 'simplebox', // name of image

    init: function( editor ) {
        // Special Case: Stylesheets Required Only Inside the Editor
        CKEDITOR.addCss(`.simplebox {padding: 8px;margin: 10px;background: #eee;border-radius: 8px;border: 1px solid #ddd;box-shadow: 0 1px 1px #fff inset, 0 -1px 0px #ccc inset;}
        .simplebox-title, .simplebox-content {
            box-shadow: 0 1px 1px #ddd inset;
            border: 1px solid #cccccc;
            border-radius: 5px;
            background: #fff;
        }
        .simplebox-title {
            margin: 0 0 8px;
            padding: 5px 8px;
        }
        .simplebox-content {
            padding: 0 8px;
        }`)
        
        // Widget Registration
        editor.widgets.add('simplebox', {
            //insert: createInput(), //alert("action"),

            button: 'simplebox', // tooltip

            template:
                '<div class="simplebox">' +
                    '<h2 class="simplebox-title">Title</h2>' +
                    '<div class="simplebox-content"><p>Content...</p></div>' +
                '</div>',

            editables: {
                title: {
                    selector: '.simplebox-title'
                },
                content: {
                    selector: '.simplebox-content'
                }
            },

            allowedContent:
                'div(!simplebox); div(!simplebox-content); h2(!simplebox-title)',

            requiredContent: 'div(simplebox)',

            upcast: function( element ) {
                return element.name == 'div' && element.hasClass( 'simplebox' );
            }
        })
    }
})


