/**
* @@@BUILDINFO@@@ erh2021.jsx !Version! Fri May 22 2020 16:37:46 GMT+0300
*/

#targetengine erh2021
//=================================================================================================================================================================
//=================================================================================================================================================================
Array.prototype.forEach = function(f) {
      if ('function' == typeof f) {
            for (var i = 0; i < this.length; i++) {
                  f.apply(this, [this[i]]);
            }
      }
}
//=================================================================================================================================================================
Array.prototype.filter = function(f) {
      var ret = new Array;
      if ('function' == typeof f) {
            for (var i = 0; i < this.length; i++) {
                  f.apply(this, [this[i]]) && ret.push(this[i]);
            }
      }
      return ret;
}
//=================================================================================================================================================================
Array.prototype.map = function(f) {
      var ret = new Array;
      if ('function' == typeof f) {
            for (var i = 0; i < this.length; i++) {
                  ret.push(f.apply(this, [this[i]]));
            }
      }
      return ret;
}
//=================================================================================================================================================================
Array.prototype.atLeastOne = function(f) {
      if ('function' == typeof f) {
            for (var i = 0; i < this.length; i++) {
                  if (f.apply(this, [this[i]])) return true;
            }
      }
      return false;
}
//=================================================================================================================================================================
Array.prototype.contains = function(e) {
      for (var i = 0; i < this.length; i++) {
            if (e === this[i]) return true;
      }
      return false;
}
//=================================================================================================================================================================
Array.prototype.pushIfNotContains = function(e) {
      for (var i = 0; i < this.length; i++) {
            if (e === this[i]) return this.length;
      }
      return this.push(e);
}
//=================================================================================================================================================================
Array.prototype.select = function(f) {
      var ret = new Array;
      if ('function' == typeof f) {
            for (var i = 0; i < this.length; i++) {
                  if (f.apply(this,[this[i]])) this.push(this[i]);
            }
      }
      return ret;
}
//=================================================================================================================================================================
String.prototype.begins = function(s) {
      return ('string' == typeof s) && 
      (s.length <= this.length) && 
      (this.substr(0, s.length) == s);
}
//=================================================================================================================================================================
String.prototype.hash = function() {     
      var hash = 0, i, chr;
      for (i = 0; i < this.length; i++) {
            chr   = this.charCodeAt(i);
            hash  = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
      }
      return ('h' + hash).replace(/-/g, '_');
}
//*****************************************************************************************************************************************************************

function ERH2021(mode){
      this.artifact = 'erh2021';
      this.version = 2020.1;
      this.debug = (mode == 'debug') * 1;
      
      if (this.debug) {
            this.date = new Date;
            this.logFile = new File('/f/logs/log.txt');
            this.logFile.encoding = 'X-UNICODE-2-0-UTF-8';
            this.logFile.open('w') || alert('LOG FILE ERROR: ' + this.logFile.error);
            this.getCtr = this.ctr();
      }


      
      app && app.__proto__.erh = this;
}
//=================================================================================================================================================================
ERH2021.prototype.init = function() {
      app.erh.trace('ERH2021.init - enter');
      const eventHandlers = [ 'afterNew', 'afterOpen', 'afterSave', 'afterSaveAs', 
                              'beforeSave', 'beforeSaveAs', 'beforeClose', 'beforeQuit'];
                              
      eventHandlers
      .forEach(function(eh_name){  
            var fullName = eh_name + '_EventHandler';  
            !!app.erh[fullName] && app.addEventListener(eh_name, app.erh[fullName]) && 
                  app.erh.trace('ERH2021.init - added event listener ' + fullName);
      });
      
      app.erh.menu();
      
      app.erh.trace('ERH2021.init - exit');
}
//=================================================================================================================================================================
// EVENT HANDLERS
//=================================================================================================================================================================
ERH2021.prototype.afterNew_EventHandler = function(event) {
}
//=================================================================================================================================================================
ERH2021.prototype.afterOpen_EventHandler = function(event) {
      app.erh.trace('ERH2021.afterOpen_EventHandler - event.parent is instance of ' + event.parent.constructor.name);

      if (event.parent instanceof LayoutWindow && app.documents.length && app.erh.isArtifactPresent()) {
            app.layoutWindows[0].addEventListener('afterAttributeChanged', app.erh.toggleLayerVisibility);
            app.erh.trace('ERH2021.afterOpen_EventHandler - afterAttributeChanged event listener added');
            app.erh.rebuildAll();
            app.erh.trace('ERH2021.afterOpen_EventHandler - call rebuildAll()');
      }
}
//=================================================================================================================================================================
ERH2021.prototype.afterSave_EventHandler = function(event) {
}
//=================================================================================================================================================================
ERH2021.prototype.afterSaveAs_EventHandler = function(event) {
}
//=================================================================================================================================================================
ERH2021.prototype.beforeSave_EventHandler = function(event) {
      app.erh.rebuildAll(); 
}
//=================================================================================================================================================================
ERH2021.prototype.beforeSaveAs_EventHandler = function(event) {
      app.erh.rebuildAll();
}
//=================================================================================================================================================================
ERH2021.prototype.beforeClose_EventHandler = function(event) {
}
//=================================================================================================================================================================
ERH2021.prototype.beforeQuit_EventHandler = function(event) {
      app.erh.menuDestroy();
}
//=================================================================================================================================================================
ERH2021.prototype.rebuildAll = function() {
      with(app.erh) {
            app.erh.trace('ERH2021.rebuildAll - enter');
            if (isArtifactPresent()){
                  app.erh.trace('ERH2021.rebuildAll - call fillTextsForHeaders()');
                  fillTextsForHeaders(); // prepare text replacement
                  app.erh.trace('ERH2021.rebuildAll - call deleteERHF()');
                  deleteERHF(); // delete all ERHF textframes first 
                  app.erh.trace('ERH2021.rebuildAll - call createERHF()');
                  createERHF(); // recreate them again to consider all changes
            }
            app.erh.trace('ERH2021.rebuildAll - exit');
      }
}
//=================================================================================================================================================================
// MENU
//=================================================================================================================================================================
ERH2021.prototype.menu = function() {
      app.erh.trace('ERH2021.menu - enter');
      
      
      var   menuType = app.menus[0].submenus[3],
            menu_Element = menuType.submenus.add(app.erh.strings.MenuTypeSub, LocationOptions.AT_END),
            scriptMenuActions = [];
            
            app.erh.menuReg.menuType = menuType.toSpecifier();
            app.erh.menuReg.menu_Element = menu_Element.toSpecifier();
            
            with (scriptMenuActions) {
                  push( app.scriptMenuActions.add(app.erh.strings.MenuERHNoOpenFiles, {label: 'sma_0'}) );
                  push( app.scriptMenuActions.add(app.erh.strings.MenuERHOnFirstPage, {label: 'sma_1'}) );
                  push( app.scriptMenuActions.add(app.erh.strings.MenuERHOnLastPage,  {label: 'sma_2'}) );
                  push( app.scriptMenuActions.add(app.erh.strings.MenuERHOnCEPages,   {label: 'sma_3'}) );
            }
      
            scriptMenuActions.forEach(function(sma){ 
                  
                  sma.addEventListener('beforeDisplay', app.erh['sma_beforeDisplay_EventHandler']);
                  sma.addEventListener('onInvoke', app.erh['sma_onInvoke_EventHandler']);
                  
                  app.erh.trace('ERH2021.menu: Set event listeners for types: ' + sma.eventListeners.everyItem().eventType.join());

                  
                  var forReg = menu_Element.menuItems.add(sma); 
                  app.erh.menuReg[sma.label] = forReg.toSpecifier();
            });
      
            menuType.menuSeparators.add(LocationOptions.BEFORE, menu_Element);
            menuType.submenus.item(menu_Element.title).menuSeparators.add(LocationOptions.AFTER, menu_Element.menuItems[0]);
            
      app.erh.trace('ERH2021.menu - exit');
}
//=================================================================================================================================================================
ERH2021.prototype.sma_beforeDisplay_EventHandler = function(event) {
      var   dc = app.erh.getDocumentСonclusion(),
            code;
      
      app.erh.trace('ERH2021.sma_beforeDisplay_EventHandler - event parent = ' + event.parent.label + ', doc conclusion: ' + dc);
      
      var documentProcessingStatus = eval(app.activeDocument.extractLabel('sma'));
      
      switch (event.parent.label) {         
            case 'sma_0':
                  event.parent.name = [
                        app.erh.strings.MenuERHNoOpenFiles,
                        app.erh.strings.MenuERHCancel,
                        app.erh.strings.MenuERHToStart,
                        app.erh.strings.MenuERHToStart,
                        app.erh.strings.MenuERHFileIsNotReady, 
                  ][dc];
                  event.parent.enabled = true;
                  code = [
                        'fileOpenDialog',
                        'fileStopHandling',
                        'fileBeginHandling',
                        'fileBeginHandling',
                        'fileIsNotReady',
                  ][dc];
                              
                  app.erh.insertData('call', code);          
                  break;
                  
            case 'sma_1':
            case 'sma_2':
            case 'sma_3':
                  event.parent.enabled = [
                        false,
                        true,
                        false,
                        false,
                        false    
                  ][dc];
                  event.parent.checked =  event.parent.enabled && !!app.documents.length && documentProcessingStatus[event.parent.label];
                  break;
            default:
                  app.erh.trace('ERH2021.sma_beforeDisplay_EventHandler - event parent = ' + event.parent.label + ', code: ' + code);
      }
}
//=================================================================================================================================================================
ERH2021.prototype.sma_onInvoke_EventHandler = function(event) {
      app.erh.trace('ERH2021.sma_onInvoke_EventHandler - event parent = ' + event.parent.label);
      
      var documentProcessingStatus = eval(app.activeDocument.extractLabel('sma') || {sma_0: false, sma_1: false, sma_2: false, sma_3: false});
      
      switch (event.parent.label) {
            case 'sma_0':
                  app.erh[app.erh.extractData('call')]();
                  break;
                  
            case 'sma_1':
                  documentProcessingStatus.sma_1 = !documentProcessingStatus.sma_1;
                  break;
            case 'sma_2':
                  documentProcessingStatus.sma_2 = !documentProcessingStatus.sma_2;
                  break;
            case 'sma_3':
                  documentProcessingStatus.sma_3 = !documentProcessingStatus.sma_3;
                  break;
      }
      
      app.activeDocument.insertLabel('sma', documentProcessingStatus.toSource());
      app.erh.rebuildAll();
}
//=================================================================================================================================================================
ERH2021.prototype.menuReg = {}
//=================================================================================================================================================================
ERH2021.prototype.menuGetElementByLabel = function(label) {
      if ('string' == typeof label) {
            if (label in app.erh.menuReg) {
                  var ret = resolve(app.erh.menuReg[label]);
                  ret.isValid;
                  return ret;
            }
      }
}
//=================================================================================================================================================================
ERH2021.prototype.menuDestroy = function() {
      for (var s in app.erh.menuReg) resolve(s) && s.isValid && s.remove();
      app.erh.trace('ERH2021.menuDestroy - OK');
}
//=================================================================================================================================================================
// BEHAVIOR
//=================================================================================================================================================================
ERH2021.prototype.getDocumentСonclusion = function() {
      /* return:
            0 - no open files;
            1 - doc is already under ERH (has running headers, folios, and artifact); possibly CANCEL
            2 - doc has running headers or folios, but is not under ERH (there isn't artifact in it); possibly START HANDLING
            3 - doc hasn't running headers at all, but has folios (partial handling is possible); possibly START HANDLING
            4 - doc hasn't running readers or folios at all (still empty doc). 
       */
      var ret = 0;
      
      if (app.documents.length) {
            
            var   rh = app.erh.hasDocumentRH(),
                  fo = app.erh.hasDocumentF(),
                  ar = app.erh.isArtifactPresent();
                      
            if (rh && fo && ar) ret = 1;
            if ((rh || fo) && !ar) ret = 2;
            if (!rh && fo && !ar) ret = 3;
            if (!rh && !fo && !ar) ret = 4;
            
            app.erh.trace('ERH2021.getDocumentСonclusion, ret = ' + ret);
      }
      return ret;
}
//=================================================================================================================================================================
ERH2021.prototype.toggleLayerVisibility = function(event) {
      if ((event.currentTarget instanceof LayoutWindow) || app.activeWindow instanceof LayoutWindow) {
            
            var   saveLayer = app.activeDocument.activeLayer,
                  m_layer = app.activeDocument.layers.itemByName('erh_m_layer'),
                  w_layer = app.activeDocument.layers.itemByName('erh_w_layer');
                  
            if (m_layer && m_layer.isValid && w_layer && w_layer.isValid) {
                  m_layer.visible = app.activeWindow.activeSpread instanceof MasterSpread;
                  w_layer.visible = !m_layer.visible;
            }   
            app.activeDocument.activeLayer = saveLayer;
            m_layer = w_layer = saveLayer = undefined;
      } 
}
//=================================================================================================================================================================
ERH2021.prototype.bringData = {}
//=================================================================================================================================================================
ERH2021.prototype.insertData = function(name, d) {
      app.erh.bringData[name] = d;
}
//=================================================================================================================================================================
ERH2021.prototype.extractData = function(name) {
      var data = app.erh.bringData[name];
      delete app.erh.bringData[name];
      return data;
}
//=================================================================================================================================================================
ERH2021.prototype.fileOpenDialog = function() {
      var menuAction = app.menuActions.item(30).getElements()[0];
      if (menuAction) menuAction.invoke();
}
//=================================================================================================================================================================
ERH2021.prototype.fileBeginHandling = function() {
      if (confirm('The document will be served using ERH (Enchanced Running Headers)', false, 'ERH 2021')) {
            with (app.erh) {
                  insertArtifact();                         ///***** first time
                  deleteHelperLayers();
                  createHelperLayers();                     ///***** first time
                  moveMasterPageItemsRHF2HelperLayerM();    ///***** first time                  
                  rebuildAll();
            }
      }
}
//=================================================================================================================================================================
ERH2021.prototype.fileStopHandling = function() {
      if (confirm('Do you want to stop processing the document?', true, 'ERH 2021')) {
            with (app.erh) {
                  if (moveMasterPageItemsRHF2TheirOriginalLayers()){
                        
                        deleteERHF();
                        deleteHelperLayers();
                        removeArtifact();
                  }
                  else {
                        alert('ERH 2021: error when moving RH to their original layers... ');
                  }
            }
            app.erh.trace('ERH2021.fileStopHandling - Artifact: ' + app.erh.isArtifactPresent () + ', h_layers: ' + app.erh.checkHelperLayers());
      }
}
//=================================================================================================================================================================
ERH2021.prototype.fileIsNotReady = function() {
      alert('The document ' + app.activeDocument.name + 
            ' needs completion... \nCreate textframes with running headers and/or folios on masterpages first.', 
            'ERH 2021');
}
//=================================================================================================================================================================
// TEXT HANDLING
//=================================================================================================================================================================
ERH2021.prototype.fillTextsForHeaders =  function() {
      var stylesList = new Array,
            hashvoc = '';
      //app.erh.trace('ERH2021.fillTextsForHeaders CP0');
      
      app.activeDocument.textVariables.everyItem().getElements()
      .filter(function(tv){
            //app.erh.trace('ERH2021.fillTextsForHeaders CP1: tv name = ' + tv.name);
            return tv.variableType == VariableTypes.MATCH_PARAGRAPH_STYLE_TYPE || 
                  tv.variableType == VariableTypes.MATCH_CHARACTER_STYLE_TYPE;
      })
      .map(function(tv){
            //app.erh.trace('ERH2021.fillTextsForHeaders CP2: tv name = ' + tv.name);
            return tv.variableOptions.appliedParagraphStyle || tv.variableOptions.appliedCharacterStyle;
      })
      .forEach(function(e){
            //app.erh.trace('ERH2021.fillTextsForHeaders CP3: applied para or char style name = ' + e.name);
            stylesList.pushIfNotContains(e); 
      });

      //***********************************************************
      if (app.erh.debug) {
            var allstyles = stylesList
                  .map(function(st){
                        return st.name;
                  }).join();
            app.erh.trace('ERH2021.fillTextsForHeaders STYLELIST: ' + allstyles);
      }
      //***********************************************************

      app.erh.trace('ERH2021.fillTextsForHeaders cp0 of 1');

      stylesList.forEach(function(s){

            app.activeDocument.stories.everyItem().paragraphs.everyItem().getElements()
            .filter(function(para){
                  return para.appliedParagraphStyle.id == s.id;
            })
            .forEach(function(para){
                  hashvoc += '>:>' + app.erh.textHash(para.contents) + '#@#' + para.toSpecifier();
            });
      });
      app.activeDocument.insertLabel('hashvoc', hashvoc);
      app.erh.trace('ERH2021.fillTextsForHeaders exit: hashvoc =' + hashvoc);
}
//=================================================================================================================================================================
ERH2021.prototype.getRHTextByHash = function(h) {
      var hashvoc = app.activeDocument.extractLabel('hashvoc'),
            db = {};
      
      hashvoc.split('>:>')
      .forEach(function(s){
            var rec = s.split('#@#');
            db[rec[0]] = rec[1];
      });
      
      //var paraNum = resolve(db[h]).paragraphs[0].bulletsAndNumberingResultText;
      //return (paraNum + ' ' + resolve(db[h]).contents) || null;
      
      return resolve(db[h]).paragraphs[0]; // paragraph!
}
//=================================================================================================================================================================
ERH2021.prototype.textEdit = function textEdit(para, insertNumberingFlag, removeEndingPunctuationFlag, replaceNonJoinMarkersByLineBreaksFlag) {
      
      app.erh.trace('ERH2021.textEdit: arg para constructor name = ' + para.constructor.name);

      var txt = para.contents || '',
          bulletsAndNumbers = insertNumberingFlag ? para.bulletsAndNumberingResultText : '',  
          endingPunctuation = removeEndingPunctuationFlag ? /[@#~`.,:;]\s*$/g : /\u0000/g,
          insertLineBreaks = replaceNonJoinMarkersByLineBreaksFlag ? /\u200c/g : /\u0000/g; 
      
      app.erh.trace('ERH2021.textEdit: cp0');
      
      var ret = ''.concat(
            bulletsAndNumbers, //вставить нумерацию параграфа
            txt
            .replace(/[\r\n]{1,}/g,' ') // баг замены принудительного переноса на новую строку пустым символом
            .replace(endingPunctuation,'') // снять концевую пунктуацию (знаки ! ? ... не снимаем)
            .replace(insertLineBreaks,'\n') // расставить разрывы строк в колонтитулах
          );
          
      app.erh.trace('ERH2021.textEdit: return = ' + ret);      
      return ret;      
}
//=========================================================================================================================================================
ERH2021.prototype.textSqueeze = function textSqueeze(txt) {
      const   whites = /[\u2001-\u200A\u200C\u202F\x0A\x0D\x20\xA0\r\n]/g;            
      return  ''.concat(txt)
            .replace(/^[\s\uFEFF\x0A]+|[\s\uFEFF\x0A]+$/g,'')
            .replace(whites,'')
            .replace(/[\/._;]/g,'')
            .toLowerCase(); 
}
//=========================================================================================================================================================
ERH2021.prototype.textHash = function(txt) {
      return app.erh.textSqueeze(txt).hash();
}
//=================================================================================================================================================================
// UTILITIES UTL
//=================================================================================================================================================================
ERH2021.prototype.createHelperLayers = function() {
      if (app.documents.length && app.erh.isArtifactPresent() && !app.erh.checkHelperLayers()){
            var layers = [
                              { name: 'erh_m_layer', layerColor: UIColors.RED },
                              { name: 'erh_w_layer', layerColor: UIColors.GOLD }
                         ];
            var m_layer = app.activeDocument.layers.add(layers[0]),
                w_layer = app.activeDocument.layers.add(layers[1]);
                
            app.erh.trace('UTL001 createHelperLayers... erh_m_layer: ' + m_layer.isValid + ', erh_w_layer: ' + w_layer.isValid);    
      }
}
//=================================================================================================================================================================
ERH2021.prototype.moveMasterPageItemsRHF2HelperLayerM = function() {
      var currentLayer, m_layer;
      
      if (app.documents.length) {
            
            currentLayer = app.activeDocument.activeLayer; // save the active layer
            app.activeDocument.activeLayer = app.activeDocument.layers.itemByName('erh_m_layer'); // master helper layer
            
            app.activeDocument.masterSpreads.everyItem().pages.everyItem().pageItems.everyItem().getElements()
            .filter(function(pi){
                   return (pi instanceof TextFrame) || (pi instanceof Group);
             })
            .map(function(pi){
                   return pi instanceof TextFrame ? [pi] : pi.textFrames.everyItem().getElements();
                   //alert('hasOwnProperty erhTextFrames ? ' + pi.hasOwnProperty('erhTextFrames'));
                   //return pi.erhTextFrames();
            })
            .forEach(function(tfarr){
                  tfarr
                  .forEach(function(tf){ 
                        var   testRH = tf.textVariableInstances.everyItem().getElements()
                              .map(function(tvi){
                                    return tvi.associatedTextVariable.variableType;
                              })
                              .atLeastOne(function(varType){
                                    return varType == VariableTypes.MATCH_PARAGRAPH_STYLE_TYPE || 
                                           varType == VariableTypes.MATCH_CHARACTER_STYLE_TYPE;
                              });
                        //app.erh.trace('ERH2021.moveMasterPageItemsRHF2HelperLayerM: tf#' + tf.id + ' rh = ' + testRH);
                        
                        var   testF = tf.characters.everyItem().contents
                              .atLeastOne(function(ch){
                                    return ch == SpecialCharacters.AUTO_PAGE_NUMBER; 
                              });
                        //app.erh.trace('ERH2021.moveMasterPageItemsRHF2HelperLayerM: tf#' + tf.id + ' f = ' + testF);
                        
                        if (testRH || testF) {
                              tf.insertLabel('start_layer', tf.itemLayer.toSpecifier());
                              //app.erh.trace('ERH2021.moveMasterPageItemsRHF2HelperLayerM: layer specifier:\n' + tf.extractLabel('start_layer'));
                              tf.name = (testRH && testF) ? ('rh_f_' + tf.id) : (testRH ? 'rh_' + tf.id : (testF ? 'f_' + tf.id : 'textframe_' + tf.id));
                              tf.move(app.activeDocument.activeLayer);
                        }
                  });
            });
            
            app.erh.trace('UTL002 Moving master pageitems (RH, F) to the helper layer "erh_m_layer" : OK');
            app.activeDocument.activeLayer = currentLayer; // set the layer formerly active
      }
}
//=================================================================================================================================================================
ERH2021.prototype.moveMasterPageItemsRHF2TheirOriginalLayers = function() {

      if (app.documents.length) {
            
            
            var   m_layer = app.activeDocument.layers.itemByName('erh_m_layer'),
                  m_error = false;
                  
            if (m_layer.isValid) {
                  
                  app.activeDocument.masterSpreads.everyItem().pages.everyItem().textFrames.everyItem().getElements()
                  .filter(function(tf){
                        return tf.itemLayer.id == m_layer.id;
                  })
                  .forEach(function(tf){
                        app.erh.trace('ERH2021.moveMasterPageItemsRHF2TheirOriginalLayers: tf#' + tf.id);
                        try {
                              var   specifier = tf.extractLabel('start_layer'),
                                    start_layer = resolve(specifier);
                                    
                              if (start_layer.isValid) {
                                    tf.move(start_layer);
                                    app.erh.trace('ERH2021.moveMasterPageItemsRHF2TheirOriginalLayers: tf#' + tf.id + ' has been moved.');
                              }
                        }
                        catch (e){
                              m_error = true;
                              app.erh.trace('ERH2021.moveMasterPageItemsRHF2TheirOriginalLayers: ERROR.' + e);
                        }
                  });
            }
            return !m_error;
      }
}
//=================================================================================================================================================================
ERH2021.prototype.createERHF = function(){
      
      var   activeLayerHolder = app.activeDocument.activeLayer,
            m_layer = app.activeDocument.layers.itemByName('erh_m_layer'),
            w_layer = app.activeDocument.layers.itemByName('erh_w_layer'),
            duplicatedItem,
            sma = eval(app.activeDocument.extractLabel('sma'));
                  
            //app.erh.trace('ERH2021.createERHF cp0');
            
      if (m_layer.isValid && w_layer.isValid) {
                  
                  
            var   sectionPages = app.activeDocument.sections.everyItem().pageStart
                  .map(function(sps){
                        return sps.id;
                  });
            
            var   preSectionPages = app.activeDocument.sections.everyItem().pageStart
                  .map(function(sps){
                        var p = app.activeDocument.pages.previousItem(sps);
                        return !!p && p.isValid && p.id;
                  })
                  .concat(app.activeDocument.pages.lastItem().id); //Если в документе только одна секция, или самая последняя страница
            
            if (app.erh.debug) {
                  var zzzz = app.activeDocument.sections.everyItem().pageStart
                        .map(function(sps){
                              var p = app.activeDocument.pages.previousItem(sps);
                              return !!p && p.isValid && p.name;  
                        })
                        .concat(app.activeDocument.pages.lastItem().name);
      
                  app.erh.trace('ERH2021.createERHF cp0 presectionPages names:' + zzzz.join());
            }
      
            app.erh.trace('ERH2021.createERHF cp1 preSectionPages ids: ' + preSectionPages.join());
                  
            app.activeDocument.pages.everyItem().getElements()
            .forEach(function(pg){         
                  pg.masterPageItems
                  .filter(function(mPgItem){
                        return mPgItem.itemLayer == m_layer && /(TextFrame|Group)/g.test(mPgItem.constructor.name);
                  })
                  .forEach(function(tf){
                        app.erh.trace('ERH2021.createERHF cp1-1 page=' + pg.name + ', tf.id=' + tf.id); 
                        
                        if ( //Выполнение условий для стартовых страниц разделов (sections)
                              sectionPages.contains(pg.id) &&
                              tf.name.begins('rh_') &&
                              !sma.sma_1 //если в меню отмечен элемент установки колонтитулов на первых страницах разделов
                           ) return;
                                  
                        app.erh.trace('ERH2021.createERHF cp2');      
                              
                        duplicatedItem = app.erh.tfPosition(tf.duplicate(pg)); // Установлено положение на странице !!!!
                        
                       
                        
                        app.erh.trace('ERH2021.createERHF cp2-1 tf.id =' + tf.id + ', duplicate id = ' + duplicatedItem.id);
                  
                        //duplicatedItem.insertLabel('position_on_page', tf.extractLabel('position_on_page'));
                        duplicatedItem.itemLayer = w_layer;
                        duplicatedItem.visible = true;
                        
                        
                  
                        duplicatedItem.name = tf.name.begins('rh_') ? 
                              'rh_c_' + duplicatedItem.id : 'f_c_' + duplicatedItem.id;
                              
                              
//~                         app.erh.trace('ERH2021.createERHF cp3-1: preSectionPages.contains(pg.id)=' + preSectionPages.contains(pg.id));
//~                         app.erh.trace('ERH2021.createERHF cp3-2: !sma_2 = ' + !sma.sma_2);
//~                         var ssss = duplicatedItem.extractLabel('tf_position');
//~                         app.erh.trace('ERH2021.createERHF cp3-3: tf_position == bottom : ' + (ssss == 'bottom'));
//~                         app.erh.trace('ERH2021.createERHF cp3-4: name begins of f_ ' + tf.name.begins('f_'));
                              
                        // Если f_c_ находится на странице перед началом новой секции, то нужно проверить меню sma_2 и удалить объект при необходимости    
                        if (
                              preSectionPages.contains(pg.id) &&
                              tf.name.begins('f_') &&
                              !sma.sma_2 && // Пожелание пользователя (отметка меню инвертированная)
                              duplicatedItem.extractLabel('tf_position') == 'bottom' // И ЕСЛИ КОЛОНЦИФРА НАХОДИТСЯ ВНИЗУ СТРАНИЦЫ
                           ){
                                 duplicatedItem.remove();
                                 return;
                           };
                              
                        //app.erh.trace('ERH2021.createERHF cp4: ');

                        if (duplicatedItem instanceof TextFrame) {
                              
                              app.erh.correctTextVariableInstances(duplicatedItem.textVariableInstances.everyItem().getElements());
                              app.erh.trace('ERH2021.createERHF cp5');
                        } else if (duplicatedItem instanceof Group) {
                              duplicatedItem.textFrames.everyItem().getElements()
                              .forEach(function(tf){
                                    
                                    app.erh.correctTextVariableInstances(tf.textVariableInstances.everyItem().getElements());
                                    app.erh.trace('ERH2021.createERHF cp6');
                              });
                        }
                  });
            });

            m_layer.visible = app.activeWindow.activeSpread instanceof MasterSpread;
            app.activeDocument.activeLayer = saveLayer;
            m_layer = w_layer = duplicatedItem = saveLayer =  undefined;
      }
}
//======================================================================================================================================================================
/**
      Замена штатно сформированного текста текстовой переменной исправленным с добавлением нумератора исходного абзаца 
      и сохранением правил оформления текстовой переменной
 */
ERH2021.prototype.correctTextVariableInstances = function (tviArr) { 
      tviArr
      .forEach(function(tvi){
            var   txtVar = tvi.associatedTextVariable,
                  txt = tvi.resultText
                        .replace(txtVar.variableOptions.textBefore,'')
                        .replace(txtVar.variableOptions.textAfter,'');
                            
            //app.erh.trace('ERH2021.correctTextVariableInstances - cp0: tvi name ="' + tvi.name + '", text = "' + txt +'"'); 
            
            if (!txt) return;
            
            var   paragraphForReplace = app.erh.getRHTextByHash(app.erh.textHash(txt));
            //app.erh.trace('ERH2021.correctTextVariableInstances - cp0-2: para for replace: ' + paragraphForReplace.toSpecifier());
            
            var   txtForReplace = app.erh.textEdit(paragraphForReplace, true, true, true); //TEMPORARY triple true (for last correct use)
            
            //app.erh.trace('ERH2021.correctTextVariableInstances - cp1: text for replace: "' + txtForReplace + '"');
            
            var completeText = ''.concat(
                        txtVar.variableOptions.textBefore, 
                        txtForReplace, 
                        txtVar.variableOptions.textAfter
                  ); 
            tvi.convertToText().contents = completeText;      
            //app.erh.trace('ERH2021.correctTextVariableInstances - cp2: complete text: "' + completeText + '"');      
      });
}
//=================================================================================================================================================================
ERH2021.prototype.deleteERHF = function(){
      app.erh.trace('ERH2021.deleteERHF - enter');
      if (app.documents.length && app.erh.isArtifactPresent()){
            
            var w_layer = app.activeDocument.layers.itemByName('erh_w_layer');
            
                  app.activeDocument.pages.everyItem().pageItems.everyItem().getElements()
                  .filter(function(pi){
                        return (pi.itemLayer.id == w_layer.id) && (pi instanceof TextFrame || pi instanceof Group) && /^(rh_c_|f_c_)\d+$/g.test(pi.name);
                  })
                  .forEach(function(pi){
                        app.erh.trace('ERH2021.deleteERHF  pageItem# ' + pi.id + ' (name = ' + pi.name + ')');
                        pi.remove();
                        //app.erh.trace('ERH2021.deleteERHF  pageItem# ' + pi.id + ' (isValid = ' + pi.isValid + ')');
                  });


      }
      app.erh.trace('ERH2021.deleteERHF - exit');
}
//=================================================================================================================================================================
ERH2021.prototype.checkHelperLayers = function() {
      var test =  !!app.documents.length &&
                  app.activeDocument.layers.itemByName('erh_w_layer').isValid &&
                  app.activeDocument.layers.itemByName('erh_m_layer').isValid;
      app.erh.trace('ERH2021.checkHelperLayers - ' + test);
      return test;
}
//=================================================================================================================================================================
ERH2021.prototype.deleteHelperLayers = function() {
      if (app.erh.checkHelperLayers()) {
            app.activeDocument.layers.itemByName('erh_w_layer').remove();
            app.activeDocument.layers.itemByName('erh_m_layer').remove();
      }
      app.erh.trace('ERH2021.deleteHelperLayers - ' + app.erh.checkHelperLayers());
}
//=================================================================================================================================================================
ERH2021.prototype.hasDocumentRH = function() { // 5/18/2020 OK
      var ret = false;
      app.activeDocument.masterSpreads.everyItem().pages.everyItem().pageItems.everyItem().getElements()
            .filter(function(pageItem){
                  return /(TextFrame|Group)/g.test(pageItem.constructor.name);
            }) 
            .map(function (pi){                 
                  if (pi instanceof TextFrame) return [pi];
                  if (pi instanceof Group) return pi.textFrames.everyItem().getElements();
                  return [];
            })
            .forEach(function(tfArray){
                  tfArray
                  .forEach(function(tf){
                        ret = ret || tf.textVariableInstances.everyItem().getElements()
                        .map(function(tvi) {
                              return tvi.associatedTextVariable.variableType;
                        })
                        .atLeastOne(function(varType){
                              return varType == VariableTypes.MATCH_PARAGRAPH_STYLE_TYPE || 
                                     varType == VariableTypes.MATCH_CHARACTER_STYLE_TYPE;
                        });
                  });
            }); 

      app.erh.trace('ERH2021.hasDocumentRH - ' + ret);
      return ret;
}
//=================================================================================================================================================================
ERH2021.prototype.hasDocumentF = function(){ // 5/19/2020 OK
      var ret = false;
            app.activeDocument.masterSpreads.everyItem().pages.everyItem().pageItems.everyItem().getElements()
            .filter(function(pageItem){
                  return /(TextFrame|Group)/g.test(pageItem.constructor.name);
            }) 
            .map(function (pi){                 
                  if (pi instanceof TextFrame) return [pi];
                  if (pi instanceof Group) return pi.textFrames.everyItem().getElements();
                  return [];
            })
            .forEach(function(tfArray){
                  tfArray
                  .forEach(function(tf){
                        ret = ret || tf.characters.everyItem().getElements()
                        .atLeastOne(function(ch){
                              return ch.contents == SpecialCharacters.AUTO_PAGE_NUMBER;
                        });
                  });
            }); 
      app.erh.trace('ERH2021.hasDocumentF - ' + ret);
      return ret;
}
//=================================================================================================================================================================
ERH2021.prototype.tfPosition = function(tf){
      var   pg = app.activeDocument.masterSpreads[0].pages[0],  
            pg_bounds = pg.bounds,
            pg_height = pg_bounds[2] - pg_bounds[0],
            pg_1st_q = pg_height / 4,
            pg_3rd_q = pg_1st_q * 3;
            
      if (!!tf && (tf instanceof TextFrame || tf instanceof Group)) {
            var   tf_bounds = tf.geometricBounds,
                  tf_verticalCenter = (tf_bounds[2] - tf_bounds[0]) / 2 + tf_bounds[0]; //Текстфрейм колонтитула - средняя линия высоты
            if (tf_verticalCenter <= pg_1st_q) tf.insertLabel('tf_position', 'top');
            if (tf_verticalCenter >= pg_3rd_q) tf.insertLabel('tf_position', 'bottom');
            if (tf_verticalCenter < pg_3rd_q && tf_verticalCenter > pg_1st_q) tf.insertLabel('tf_position', 'center'); 
            
            app.erh.trace('ERH2021.tfPosition - ' + tf.extractLabel('tf_position'));
      }
      return tf;
}
//=================================================================================================================================================================
// STRINGS
//=================================================================================================================================================================
ERH2021.prototype.strings = {
      MenuTypeSub:                  'Extended Running Headers && Page Numbering',
      MenuERHToStart:               'The document is ready for ERH...',
      MenuERHOnFirstPage:           'Set Running Headers on Start Pages of Sections',
      MenuERHOnLastPage:            'Set Folios on the Last Pages of Sections',
      MenuERHNoOpenFiles:           'No Open Files...',
      MenuERHOnCEPages:             'Set Running Headers, Folios, and Footers on Conditionally Empty Pages',
      MenuERHCancel:                'Cancel Processing the Document',
      MenuERHNoRHFOnMasters:        'Place the Running Headers and Folios on Master Pages First.',
      MenuERHFileIsReady:           'Document is ready for processing with ERH',
      MenuERHFileIsNotReady:        'Document needs completion...'
}
//=================================================================================================================================================================
// ARTIFACT ART 
//=================================================================================================================================================================
ERH2021.prototype.isArtifactPresent = function() {
      var ret =   app.documents.length && 
                  app.activeDocument.textVariables.itemByName(String(app.erh.artifact)) && 
                  app.activeDocument.textVariables.itemByName(String(app.erh.artifact)).isValid;
      app.erh.trace('ART001 ARTIFACT '+ (ret ? '' : 'NOT ') + 'DETECTED ' + ret);            
      return ret;            
}
//=================================================================================================================================================================
ERH2021.prototype.insertArtifact = function() { 
      var art = null;
      if (app.documents.length) {
            art = app.activeDocument.textVariables.itemByName(String(app.erh.artifact));
            if (art && art.isValid) {
                  app.erh.trace('ART002 ARTIFACT IS ALREADY INSERTED');
                  return true;
            } else {
                  art = app.activeDocument.textVariables.add({
                        name: String(app.erh.artifact),
                        variableType: VariableTypes.CUSTOM_TEXT_TYPE,
                        variableOptions: { contents: String(app.erh.version) }
                  });
            }
            
            var test = art && art.isValid;
            app.erh.trace('ART003 ARTIFACT INSERTION... ' + (test ? 'OK' : 'FALSE'));
            return test;
      } else return false;
}
//=================================================================================================================================================================
ERH2021.prototype.removeArtifact = function() {
      if (app.documents.length) { 
            var art = app.activeDocument.textVariables.itemByName(String(app.erh.artifact)); 
            if (art.isValid) art.remove();
            
            
            app.erh.trace('ART004 ARTIFACT DESTRUCTION... ' + (art && art.isValid ? 'OK' : 'FALSE'));
            return ret;
      } else return false;
}
//=================================================================================================================================================================
// DEBUG
//=================================================================================================================================================================
ERH2021.prototype.ctr = function() {
      var ctr = 0;
      return function() {
            return ++ctr;
      }
}
//=================================================================================================================================================================
ERH2021.prototype.trace = function(s) {
      app.erh.debug && app.erh.logFile.writeln('' + app.erh.getCtr()  + ': ' + s);
}
//=================================================================================================================================================================
ERH2021.prototype.shutdown = function() {
      app.erh.logFile && app.erh.logFile.isValid ? app.erh.logFile.close() : eval('');
}
//=================================================================================================================================================================
const erh2021 = new ERH2021('-debug')
erh2021.init();


