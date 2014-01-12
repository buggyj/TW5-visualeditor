/*
 Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 For licensing, see LICENSE.md or http://ckeditor.com/license
*/
CKEDITOR.dialog.add("verbatim", function (b) {
    function d(a) {
        var b = this.getValue();
        b ? (a.attributes[this.id] = b, "name" == this.id && (a.attributes["data-cke-saved-name"] = b)) : (delete a.attributes[this.id], "name" == this.id && delete a.attributes["data-cke-saved-name"])
    }
    return {
        title: b.lang.forms.button.title,
        minWidth: 350,
        minHeight: 150,
        onShow: function () {
            delete this.verbatim; 
            var a = this.getParentEditor().getSelection().getSelectedElement();
            if (!!a && a.is("input") && a.getAttribute("name") =="untiddlywiki") {
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
                c = b ? CKEDITOR.htmlParser.fragment.fromHtml(b.getOuterHtml()).children[0] : new CKEDITOR.htmlParser.element("input");
            this.commitContent(c);
            c.attributes['name']="untiddlywiki";
            c.attributes['type']="button";
            
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
                type: "text",
                label: b.lang.forms.button.text,
                accessKey: "V",
                "default": "",
                setup: function (a) {
                    this.setValue(a.getAttribute("value") || "")
                },
                commit: d
            }]
        }]
    }
});
