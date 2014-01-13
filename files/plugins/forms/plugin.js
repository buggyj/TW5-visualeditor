/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

/**
 * @fileOverview Forms Plugin
 */

CKEDITOR.plugins.add( 'forms', {
	lang: 'en',

	onLoad: function() {	
{
			CKEDITOR.addCss( '.verbatim ' +
			'{' +
				'text-align: left;' +
				'color:#474747;' +
			'}\n' );

}},

	init: function( editor ) {
		var lang = editor.lang,
			allowedContent = {
				verbatim: 'input[type,name,value]'			
				},
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

				editor.addCommand( commandName, new CKEDITOR.dialogCommand( commandName, def ) );

				editor.ui.addButton && editor.ui.addButton( buttonName, {
					label: lang.common[ buttonName.charAt( 0 ).toLowerCase() + buttonName.slice( 1 ) ],
					command: commandName,
					toolbar: 'forms,' + ( 10 )
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

			 if ( element.is( 'div' ) ) {
				var myclass = element.getAttribute( 'class' ) || '';
				
				switch ( myclass ) {
					case 'verbatim':
				
						 evt.data.dialog = 'verbatim';
						break;

				}
			}
			if ( element.is( 'div' ) ) {if (element.getAttribute( 'class' )=="jeff") alert("jeff")};
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
