/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

/**
 * @fileOverview Forms Plugin
 */

CKEDITOR.plugins.add( 'forms', {
	requires: 'dialog,fakeobjects',
	lang: 'af,ar,bg,bn,bs,ca,cs,cy,da,de,el,en,en-au,en-ca,en-gb,eo,es,et,eu,fa,fi,fo,fr,fr-ca,gl,gu,he,hi,hr,hu,id,is,it,ja,ka,km,ko,ku,lt,lv,mk,mn,ms,nb,nl,no,pl,pt,pt-br,ro,ru,si,sk,sl,sq,sr,sr-latn,sv,th,tr,ug,uk,vi,zh,zh-cn', // %REMOVE_LINE_CORE%

	onLoad: function() {
		CKEDITOR.addCss( '.cke_editable form' +
			'{' +
				'border: 1px dotted #FF0000;' +
				'padding: 2px;' +
			'}\n' );
	},
	init: function( editor ) {
		var lang = editor.lang,
			order = 0,
			textfieldTypes = { email:1,password:1,search:1,tel:1,text:1,url:1 },
			allowedContent = {

				verbatim: 'input[type,name,value]'			},
			requiredContent = {
				verbatim: 'input'
			};

		// All buttons use the same code to register. So, to avoid
		// duplications, let's use this tool function.
		var addButtonCommand = function( buttonName, commandName, dialogFile ) {
				var def = {
					allowedContent: allowedContent[ commandName ],
					requiredContent: requiredContent[ commandName ]
				};
				commandName == 'form' && ( def.context = 'form' );

				editor.addCommand( commandName, new CKEDITOR.dialogCommand( commandName, def ) );

				editor.ui.addButton && editor.ui.addButton( buttonName, {
					label: lang.common[ buttonName.charAt( 0 ).toLowerCase() + buttonName.slice( 1 ) ],
					command: commandName,
					toolbar: 'forms,' + ( order += 10 )
				});
				CKEDITOR.dialog.add( commandName, dialogFile );
			};

		var dialogPath = this.path + 'dialogs/';

		addButtonCommand( 'Verbatim', 'verbatim', dialogPath + 'verbtim.js' );

		// If the "menu" plugin is loaded, register the menu items.
		if ( editor.addMenuItems ) {
			var items = {

				button: {
					label: lang.forms.button.title,
					command: 'verbatim',
					group: 'button'
				}
			};
			editor.addMenuItems( items );

		}

		// If the "contextmenu" plugin is loaded, register the listeners.
		if ( editor.contextMenu ) {
			editor.contextMenu.addListener( function( element, selection, path ) {
				return { button: CKEDITOR.TRISTATE_OFF };
			});


		}

		editor.on( 'doubleclick', function( evt ) {
			var element = evt.data.element;

			 if ( element.is( 'input' ) ) {
				var type = element.getAttribute( 'type' ) || 'text';
				var name =element.getAttribute( 'name' ) || '';
				switch ( type ) {
					case 'button':
				
						if (name==="untiddlywiki") evt.data.dialog = 'verbatim';
						break;

				}
			}
		});
	},

	afterInit: function( editor ) {
		var dataProcessor = editor.dataProcessor,
			htmlFilter = dataProcessor && dataProcessor.htmlFilter,
			dataFilter = dataProcessor && dataProcessor.dataFilter;

		// Cleanup certain IE form elements default values.
		// Note: Inputs are marked with contenteditable=false flags, so filters for them
		// need to be applied to non-editable content as well.
		if ( CKEDITOR.env.ie ) {
			htmlFilter && htmlFilter.addRules( {
				elements: {
					input: function( input ) {
						var attrs = input.attributes,
							type = attrs.type;
						// Old IEs don't provide type for Text inputs #5522
						if ( !type )
							attrs.type = 'text';
						if ( type == 'checkbox' || type == 'radio' )
							attrs.value == 'on' && delete attrs.value;
					}
				}
			}, { applyToAll: true } );
		}

		if ( dataFilter ) {
			dataFilter.addRules( {
				elements: {
					input: function( element ) {
						if ( element.attributes.type == 'hidden' )
							return editor.createFakeParserElement( element, 'cke_hidden', 'hiddenfield' );
					}
				}
			}, { applyToAll: true } );
		}
	}
});

if ( CKEDITOR.env.ie ) {
	CKEDITOR.dom.element.prototype.hasAttribute = CKEDITOR.tools.override( CKEDITOR.dom.element.prototype.hasAttribute, function( original ) {
		return function( name ) {
			var $attr = this.$.attributes.getNamedItem( name );

			if ( this.getName() == 'input' ) {
				switch ( name ) {
					case 'class':
						return this.$.className.length > 0;
					case 'checked':
						return !!this.$.checked;
					case 'value':
						var type = this.getAttribute( 'type' );
						return type == 'checkbox' || type == 'radio' ? this.$.value != 'on' : this.$.value;
				}
			}

			return original.apply( this, arguments );
		};
	});
}
