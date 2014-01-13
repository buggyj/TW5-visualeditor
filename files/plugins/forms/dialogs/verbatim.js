﻿
CKEDITOR.dialog.add("verbatim", function (b) {
    function d(a) {
        var b = this.getValue();
        if (!!b) a.setHtml($tw.utils.htmlEncode(b).replace(/(\r\n|\n|\r)/gm, "<br />"));
    }
    return {
        title: b.lang.forms.button.title,
        minWidth: 350,
        minHeight: 150,
        onShow: function () {
            delete this.verbatim; 
            var a = this.getParentEditor().getSelection().getSelectedElement();
            if (!!a && a.is("span") && a.getAttribute("class") =="verbatim") {
				this.verbatim =a; //record element to edit
                this.setupContent(a);
            }
            else {
				    var mySelection = this.getParentEditor().getSelection().getSelectedText();
                    this.setValueOf("info","value",mySelection);
			}
            
        },
        onOk: function () {
            var a = this.getParentEditor(),
                b = this.verbatim,//existing element -set in onshow()
                d = !b,
                c = b ? CKEDITOR.htmlParser.fragment.fromHtml(b.getOuterHtml()).children[0] : new CKEDITOR.htmlParser.element("span");
            this.commitContent(c);
            c.attributes['class']="verbatim";
            c.attributes['style']="background-color:#5778D8";
            c.attributes['contenteditable']="false";

            
            var e = new CKEDITOR.htmlParser.basicWriter;
            c.writeHtml(e);
            c = CKEDITOR.dom.element.createFromHtml(e.getHtml(), a.document);
            d ? a.insertElement(c) : (c.replace(b), a.getSelection().selectElement(c))
        },
        contents: [{
            id: "info",
            label: b.lang.forms.button.title,
            title: b.lang.forms.button.title,
            elements: [ {
                id: "value",
                type: "textarea",
                label: b.lang.forms.button.text,
                accessKey: "V",
                "default": "",
                setup: function (a) {//.replace(/(\r\n|\n|\r)/gm, "\\n")
                    this.setValue($tw.utils.htmlDecode(a.getHtml( ).replace(/<br \/>/gm, "\n") || ""))
                },
                commit: d
            }]
        }]
    }
});
