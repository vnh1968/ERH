#targetengine erh20213
#target InDesign
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
                  if (f.apply(this,[this[i]])) ret.push(this[i]);
            }
      }
      return ret;
}
//=================================================================================================================================================================
Array.prototype.reduce = function() {
      var ret = new Array;
      for (var i = 0; i < this.length; i++) {
            ret.pushIfNotContains(this[i]);
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
Application.prototype.erhDestructor = function(){
      this.menus.item(0).submenus.item(3).submenus.everyItem().getElements()
      .forEach(function(s){
            switch (s.title) {
                  case 'Extended Running Headers && Page Numbering':
                  case 'Extended Running Headers && Page NumberingЮ':
                  case 'ERH20211':
                  case 'ERH Rebuild':
                        s.remove();
                  break;
            }
      });
      var rebMenu = this.menus.item(0).submenus.item(3).menuItems.itemByName('Rebuild');
      if (rebMenu.isValid) rebMenu.remove();
}
//=================================================================================================================================================================
Application.prototype.erhConstructor = function erhConstructor(){
      
      const   _this = this;
      
      //binding Event Handlers
      [ 'afterNew', 'afterOpen', 'afterSave', 'afterSaveAs', 'beforeSave', 'beforeSaveAs', 'beforeClose', 'beforeQuit', 'afterQuit' ]
      .forEach(function(eh_name){   
            _this.addEventListener(eh_name, _this[eh_name + '_EventHandler']);
      });
      
      erhConstructor.strings = {
            ALLOW_RH_ON_SECTION_START_PAGES:    'Allow Running Headers To Be Placed On The Start Pages Of Sections',
            ALLOW_PN_ON_SECTION_END_PAGES:      'Allow Page Numbers To Be Placed On The Last Pages Of Sections',
            CONDITIONALLY_BLANK_PAGES:          'Prohibit The Placement Of Running Headers And Page Numbers On Conditionally Blank Pages',
            SET_LAYER_TO_BYPASS:                'Choose A Layer To Bypass Processing Rules...',
            REBUILD:                            'ERH Rebuild'
      };
      
      var   menuType = this.menus.item(0).submenus.item(3),   
            menuERH = menuType.submenus
            .add('Extended Running Headers && Page Numbering', LocationOptions.AT_END);
            
      menuType.menuSeparators.add(LocationOptions.BEFORE, menuERH);
      [    
            _this.scriptMenuActions.add('sma_0', {label: 'sma_0'}),
            _this.scriptMenuActions.add(erhConstructor.strings.ALLOW_RH_ON_SECTION_START_PAGES, {label: 'sma_1'}),
            _this.scriptMenuActions.add(erhConstructor.strings.ALLOW_PN_ON_SECTION_END_PAGES, {label: 'sma_2'}),
            _this.scriptMenuActions.add(erhConstructor.strings.CONDITIONALLY_BLANK_PAGES, {label: 'sma_3'}),
            _this.scriptMenuActions.add(erhConstructor.strings.SET_LAYER_TO_BYPASS, {label: 'sma_4'})
      ]
      .forEach(function(sma){
            
            sma.addEventListener('beforeDisplay'/*Event.BEFORE_DISPLAY*/, app.erhMenuBeforeDisplay);
            sma.addEventListener('onInvoke'/*Event.ON_INVOKE*/, app.erhMenuOnInvoke);
            var mi = menuERH.menuItems.add(sma); 
      });


      menuERH.menuSeparators.add(LocationOptions.AFTER, menuERH.menuItems.item(0)); 
      
      var   rebuildMenu = this.scriptMenuActions.add(erhConstructor.strings.REBUILD, LocationOptions.AT_END);
            rebuildMenu.addEventListener('beforeDisplay', function(event){
                  event.parent.enabled = app.documents.length && app.activeDocument.docHasAnArtifact();
            });
            rebuildMenu.addEventListener('onInvoke', function(event){
                  app.activeDocument.erhCheckList();
            });
      menuType.menuItems.add(rebuildMenu, {name: 'Rebuild'});
      
      this.erhIdleTasks();

}
//=================================================================================================================================================================
Application.prototype.afterNew_EventHandler = function(event){
}
//=================================================================================================================================================================
Application.prototype.afterOpen_EventHandler = function(event){
      if (event.parent instanceof LayoutWindow) {
            //alert('Open: ' + app.activeDocument.name);
            app.activeDocument.erhIdleTask(); // to init THIS property
            app.erhIdleTasks('switchDoc');
            //alert('switchDoc cmd sent');
      }
}
//=================================================================================================================================================================
Application.prototype.afterSave_EventHandler = function(event){
}
//=================================================================================================================================================================
Application.prototype.afterSaveAs_EventHandler = function(event){
      
}
//=================================================================================================================================================================
Application.prototype.beforeSave_EventHandler = function(event){
}
//=================================================================================================================================================================
Application.prototype.beforeSaveAs_EventHandler = function(event){
}
//=================================================================================================================================================================
Application.prototype.beforeClose_EventHandler = function(event){
}
//=================================================================================================================================================================
Application.prototype.beforeQuit_EventHandler = function(event){
}
//=================================================================================================================================================================
Application.prototype.afterQuit_EventHandler = function(event){
      this.erhDestructor();
}
//=================================================================================================================================================================
Application.prototype.erhMenuBeforeDisplay = function erhMenuBeforeDisplay(event) {
      if (event.parent instanceof ScriptMenuAction){
            erhMenuBeforeDisplay.strings = {
                  NO_OPEN_FILES:          'No Open Files...',
                  DOC_IS_READY:           'Start ERH Handling...',
                  DOC_IS_ACTIVE:          'Cancel ERH Handling...',
                  DOC_NEEDS_REFINEMENT:   'The Active Document Needs Refinement!'
            };

      var   no_open_files = !app.documents.length; // here must be used 'app' instead of 'this' because this is a callback function

            switch(event.parent.label){
                  case 'sma_0':
                        if (no_open_files) {
                              event.parent.title = erhMenuBeforeDisplay.strings.NO_OPEN_FILES; 
                              event.parent.insertLabel('code', '0');
                        }
                        else {
                              event.parent.title = 
                              app.activeDocument.docERHActive() ? /*cancel*/ erhMenuBeforeDisplay.strings.DOC_IS_ACTIVE: 
                              (app.activeDocument.docERHReady() ?  /*start*/ erhMenuBeforeDisplay.strings.DOC_IS_READY: 
                                                                  /*doc needs refinement*/ erhMenuBeforeDisplay.strings.DOC_NEEDS_REFINEMENT);
                              var code =  
                              app.activeDocument.docERHActive() ? /*cancel*/ '1': 
                              (app.activeDocument.docERHReady() ?  /*start*/ '2': 
                                                                  /*doc needs refinement*/ '3');
                              event.parent.insertLabel('code', code);                                    
                        }
                        
                        break;
                  case 'sma_1':
                  case 'sma_2':
                  case 'sma_3':
                  case 'sma_4':
                        
                        event.parent.enabled = !no_open_files && app.activeDocument.docHasAnArtifact();
                        event.parent.checked = event.parent.enabled && eval(app.activeDocument.extractLabel('smas'))[event.parent.label];
                        break;
            }
      }
}
//=================================================================================================================================================================
Document.prototype.erhCheckList = function() {
      app.activeDocument.recompileERHVocab();
      app.activeDocument.docDeleteHelperLayers();
      app.activeDocument.docCreateHelperLayers();
      app.activeDocument.copyMasterTextFrames2MLayer();
      app.activeDocument.removeAllFromWLayer();
      app.activeDocument.makeDuplicates2WLayer();
      app.activeDocument.fixAllTextFrames();
      app.activeDocument.removeUnnecessaryTFs();
}
//=================================================================================================================================================================
Application.prototype.erhMenuOnInvoke = function erhMenuOnInvoke(event) {
      var smas;
      
      try {
            if (app.documents.length) {
                  smas = eval(app.activeDocument.extractLabel('smas'));
                  smas.toSource(); //to provoke an error status when the label has not been read. do not delete this line!
            }
      }
      catch (e) {
            alert('erhMenuOnInvoke error: ' + e);
            smas = {sma_1: false, sma_2: false, sma_3: false, sma_4: false};
            app.activeDocument.insertLabel('smas', smas.toSource());
      }

      if (event.parent instanceof ScriptMenuAction){
            switch (event.parent.label){
                  case 'sma_0': {
                              var code = event.parent.extractLabel('code');
                              switch(code){
                                    case '0':
                                          app.menuActions.item(30/*'$ID/Open...'*/).invoke();
                                          break;
                                    case '1':
                                          if (confirm('Cancel ERH Handling?', true, app.erh.artifact)){
                                                app.activeDocument.docDeleteHelperLayers();
                                                app.activeDocument.docExtractArtifact();
                                          }
                                          break;
                                    case '2':
                                          if (confirm('Start ERH Handling?', false, app.erh.artifact)){
                                                app.activeDocument.docInsertArtifact();
                                                app.activeDocument.erhCheckList();
                                          }
                                          break;
                                    case '3':
                                          alert('Current Document Needs Some Refinement...\rTry to add Running Headers and Page Numbers on a master spread', app.erh.artifact);
                                          break;
                                    default:
                                          alert('Invalid code: ' + code);
                              }
                        }
                        break;
                  //invert and save      
                  case 'sma_1':
                  case 'sma_2':
                  case 'sma_3':
                  case 'sma_4':
                        smas[event.parent.label] = !smas[event.parent.label];
                        app.activeDocument.insertLabel('smas', smas.toSource());
                        app.activeDocument.erhCheckList();
                        break;
            }
      }
      app.activeDocument.insertLabel('smas', smas.toSource());
}
//=================================================================================================================================================================
Application.prototype.erh = function erh(q){
      if (q instanceof String && erh.hasOwnProperty('artifact') && erh.hasOwnProperty('version') && erh.hasOwnProperty(q)) return erh[q];
      return undefined;
}
//=================================================================================================================================================================
Application.prototype.erhIdleTasks = function erhIdleTasks(cmd){
      
      var _this = this;
      try {
            if (!erhIdleTasks.hasOwnProperty('task')) {
                  erhIdleTasks.task = app.idleTasks.add({name: '_erhIdleTask', sleep: 200});
                  erhIdleTasks.task.addEventListener(IdleEvent.ON_IDLE, function(){ $.sleep(150); });
            }
      }
      catch(e) {
      }
      
      if (erhIdleTasks.arguments.length == 0) return;
      

      switch (cmd) {
            case 'removeAll':
                  if (erhIdleTasks.task.isValid) {
                        erhIdleTasks.task.eventListeners.everyItem().remove();
                        erhIdleTasks.task.sleep = 0;
                        erhIdleTasks.task = undefined;
                  }
                  break;
                  
            case 'startNew':
                  erhIdleTasks.task = app.idleTasks.add({name: '_erhIdleTask', sleep: 3000});
                  break;
                  
            case 'switchDoc':
                  erhIdleTasks.task.eventListeners.everyItem().remove();
                  erhIdleTasks.task.addEventListener(IdleEvent.ON_IDLE, function cdf(event) { 
                        
                        if (!cdf.stopper) {
                              cdf.stopper = false;
                        }
                  
                        if (cdf.stopper) return;
                        cdf.stopper = true;
                        try {
                    
                        _this.activeDocument.erhIdleTask(event);
                        cdf.stopper = false;
                        }
                        catch(e) { alert('erhIdleTasks: ' + e); }
                  });
                  break;
            default:
                  alert('Cmd: ' + cmd);
                  break;
      }
}
//=================================================================================================================================================================
Document.prototype.erhIdleTask = function erhIdleTask(event){ //this is CALLBACK
      try {
      if (!erhIdleTask.hasOwnProperty('_this')) {
            erhIdleTask._this = this;
            erhIdleTask.prevValue = -1;      
            erhIdleTask.currValue = 0;
            
            erhIdleTask.renew = function(newValue, f) {
                  if (erhIdleTask.currVal == newValue) return;
                  else {
                        erhIdleTask.prevValue = erhIdleTask.currValue;
                        erhIdleTask.currValue = newValue;
                        if (erhIdleTask.prevValue != erhIdleTask.currValue)
                        f.apply(this, [erhIdleTask.prevValue, erhIdleTask.currValue]);
                  }
            }
            return;
      }

            erhIdleTask.renew(erhIdleTask._this.pages.length, function(prev, curr) {
                  erhIdleTask._this.erhCheckList.apply(erhIdleTask._this, []);
            });

      }
      catch(e) { alert('erhIdleTask: ' + e); }
}

//=================================================================================================================================================================
/**
      returns TRUE if doc has ERH artifact or FALSE if it hasn't
      - artifact is visible simple text variable named 'ERH\d+' where \d+ is script version
*/
//=================================================================================================================================================================
Document.prototype.docHasAnArtifact = function(){
      var ret = !!(app.activeDocument.textVariables.everyItem().getElements()
      .filter(function(tv){
            return tv && tv.isValid && (tv.variableType == VariableTypes.CUSTOM_TEXT_TYPE) && (/(ERH|erh)\d+/g.test(tv.name));
      })
      .length);
      return ret;
}
//=================================================================================================================================================================
Document.prototype.docInsertArtifact = function(){
      if (this.docHasAnArtifact()) return;
      this.textVariables.add({
            name: app.erh.artifact,
            variableType: VariableTypes.CUSTOM_TEXT_TYPE,
            variableOptions: { contents: app.erh.version} 
      });
}
//=================================================================================================================================================================
Document.prototype.docExtractArtifact = function(){
      if (!this.docHasAnArtifact()) return;
      this.textVariables.everyItem().getElements()
      .filter(function(tv){
            return tv && tv.isValid && tv.variableType == VariableTypes.CUSTOM_TEXT_TYPE && /(ERH|erh)\d+/g.test(tv.name);
      })
      .forEach(function(tv){
            tv.remove();
      });
}
//=================================================================================================================================================================
Document.prototype.docHasRHMarkers = function(){
      var ret = 
      this.masterSpreads.everyItem().pages.everyItem().pageItems.everyItem().getElements()
      .filter(function(mpi){
            return /(TextFrame|Group)/g.test(mpi.constructor.name);
      })
      .map(function(mpi){
            return (mpi instanceof TextFrame) ? [mpi] : 
            ((mpi instanceof Group) ? mpi.textFrames.everyItem().getElements() : []);
      })
      .atLeastOne(function(tfArr){
            var ret = tfArr
            .atLeastOne(function(tf){
                  return tf.tfHasRHMarkers(); 
            });
            return ret; 
      });
      return ret;
}
//=================================================================================================================================================================
Document.prototype.docHasPNMarkers = function(){
      var ret =
      this.masterSpreads.everyItem().pages.everyItem().pageItems.everyItem().getElements()
      .filter(function(mpi){
            return /(TextFrame|Group)/g.test(mpi.constructor.name);
      })
      .map(function(mpi){
            return (mpi instanceof TextFrame) ? [mpi] : 
            ((mpi instanceof Group) ? mpi.textFrames.everyItem().getElements() : []);
      })
      .atLeastOne(function(tfArr){
            var ret = tfArr
            .atLeastOne(function(tf){
                  return tf.tfHasPNMarkers();
            });
            return ret;
      });
      return ret;   
}
//=================================================================================================================================================================
Document.prototype.docERHReady = function(){
      return !this.docHasAnArtifact() && this.docHasPNMarkers() && this.docHasRHMarkers();
}
//=================================================================================================================================================================
Document.prototype.docERHActive = function(){
      var   ret =
            app.activeDocument.docHasAnArtifact() && app.activeDocument.docHasPNMarkers() && app.activeDocument.docHasRHMarkers();
      return ret;
}
//=================================================================================================================================================================
// USED IN ERH HANDLING
// Сreating two new auxiliary layers, if they have not already been created
Document.prototype.docCreateHelperLayers = function(){

      var   m_layer = this.layers.itemByName('erh_m_layer'),
            w_layer = this.layers.itemByName('erh_w_layer');
            
            if (!m_layer || !m_layer.isValid) this.layers.add({name: 'erh_m_layer', layerColor: UIColors.RED});
            if (!w_layer || !w_layer.isValid) this.layers.add({name: 'erh_w_layer', layerColor: UIColors.GOLD});
            
            m_layer.locked = false;
            w_layer.locked = false;
}
//=================================================================================================================================================================
// REBUILDING
Document.prototype.copyMasterTextFrames2MLayer = function(duplicate){ 
      try {
            var   toLayer = this.layers.itemByName('erh_m_layer');
                  if (!(toLayer.isValid)) {
                        return;
                  }
                      
            toLayer.textFrames.everyItem().remove();      

            this.pages.everyItem().appliedMaster
            .reduce()
            .forEach(function(mp){
                  mp.textFrames.everyItem().getElements()
                  .filter(function(tf){
                        tf.visible = true;
                        tf.locked = false;
                        var ret = (tf.itemLayer.id != toLayer.id) &&
                        (tf.tfHasRHMarkers() || tf.tfHasPNMarkers());
                        return ret;
                  })
                  .forEach(function(tf){
                        duplicate = tf.duplicate(tf.parentPage);
                        duplicate.insertLabel('copyOf', tf.toSpecifier());
                        duplicate.itemLayer = toLayer;
                        tf.locked = true;
                        tf.visible = false;
                  });
            });
      }
      catch(e) { alert('copyMasterTextFrames2MLayer: ' + e);}
}
//=================================================================================================================================================================
// USED IN ERH CANCELLING: REMOVE ALL ERH ARTIFACTS
// The layer 'erh_w_layer' can be destroyed at any time 
// The layer 'erh_m_layer' can be destroyed because it contains copies of existing page elements that have visibility disabled. So make originals visible.
Document.prototype.docDeleteHelperLayers = function(){

      var   m_layer = this.layers.itemByName('erh_m_layer'),
            w_layer = this.layers.itemByName('erh_w_layer');
            
            if (m_layer && w_layer) {
                  if (m_layer.isValid) {
                        app.activeDocument.masterSpreads.everyItem().pageItems.everyItem().getElements()
                        .filter(function(pi){
                              var   ret = pi.isValid && 
                                    pi instanceof TextFrame && 
                                    pi.itemLayer.id == m_layer.id;
                              return ret;      
                        })
                        .forEach(function(pi){
                              pi.locked = false;
                              var piOrig;
                              try {
                                    piOrig = resolve(pi.extractLabel('copyOf'));
                                    if (piOrig && (piOrig instanceof TextFrame)) {
                                          piOrig.locked = false;
                                          piOrig.visible = true;
                                          piOrig.geometricBounds = pi.geometricBounds;
                                          pi.remove();
                                    }
                              }
                              catch(e) { alert(e); }
                        });
                  }
                  if (w_layer.isValid) {
                        w_layer.locked = false;
                        w_layer.pageItems.everyItem().getElements()
                        .forEach(function(wpi){
                              wpi.locked = false;
                              wpi.remove();
                        });
                  }
            }
}
//=================================================================================================================================================================
Document.prototype.recompileERHVocab = function recompileERHVocab(){
      var _this = this;
      if (!this.docHasRHMarkers()) return;     
      if (!recompileERHVocab.vocab) recompileERHVocab.vocab = {};
      if (this.textVariables.length) {
       
      var   paraStyles =
            this.textVariables.everyItem().getElements()
            .filter(function(tv){
                  return tv.variableType == VariableTypes.MATCH_PARAGRAPH_STYLE_TYPE;
            })
            .map(function(tv){
                  return tv.variableOptions.appliedParagraphStyle;  
            });
      
      var   hashvoc = '';      
            paraStyles
            .forEach(function(s){
                  _this.stories.everyItem().paragraphs.everyItem().getElements()
                  .filter(function(para){
                        return para.appliedParagraphStyle.id == s.id;
                  })
                  .forEach(function(para){
                        hashvoc += '>:>' + _this.textHash(para.contents) + '#@#' + para.toSpecifier();
                  });
            });
            app.activeDocument.insertLabel('hashvoc', hashvoc); 
      }
}
//==================================================================================================================================================================
Document.prototype.getERHTextByHash = function(h) {
      var   hashvoc = this.extractLabel('hashvoc'),
            db = {};
      
      hashvoc.split('>:>')
      .forEach(function(s){
            var rec = s.split('#@#');
            db[rec[0]] = rec[1];
      });
      return resolve(db[h]).paragraphs[0]; // paragraph!
}
//==================================================================================================================================================================
Document.prototype.textSqueeze = function textSqueeze(txt) {
      const   whites = /[\u2001-\u200A\u200C\u202F\x0A\x0D\x20\xA0\r\n]/g;            
      return  ''.concat(txt)
            .replace(/^[\s\uFEFF\x0A]+|[\s\uFEFF\x0A]+$/g,'')
            .replace(whites,'')
            .replace(/[\/._;]/g,'')
            .toLowerCase(); 
}
//==================================================================================================================================================================
Document.prototype.textHash = function(txt) {
      return this.textSqueeze(txt).hash();
}
//==================================================================================================================================================================
Document.prototype.makeDuplicates2WLayer = function(){
      var   _this = this,   
            m_layer = this.layers.itemByName('erh_m_layer'),
            w_layer = this.layers.itemByName('erh_w_layer'),
            noneMaster = this.masterSpreads.itemByName('[None]');
                 
      if (!m_layer.isValid || !w_layer.isValid) return;

      this.pages.everyItem().getElements()
      .forEach(function(pg){
            
            var master = pg.appliedMaster;
            if (master == NothingEnum.NOTHING) return;
            
            var masterPages = master.pages.everyItem().getElements()
            .filter(function(mpg){
                  return mpg.side == pg.side;
            });

            masterPages
            .forEach(function(mp){
                  mp.pageItems.everyItem().getElements()
                  .filter(function(mpi){
                        return mpi.itemLayer == m_layer;
                  })
                  .forEach(function(mpi){
                        try {
                              if (!mpi.overridden) {
                                  var     mpiGB = mpi.geometricBounds,
                                          overrPI = mpi.override(pg);
                                  overrPI.geometricBounds = mpiGB;
                                  overrPI.itemLayer = w_layer;
                              } 
                        }
                        catch(e){}
                  });
            });
      });  
}
//=================================================================================================================================================================
Document.prototype.removeAllFromWLayer = function(){
      var w_layer = this.layers.itemByName('erh_w_layer');
      if (w_layer.isValid) {
            w_layer.locked = false;
            w_layer.pageItems.everyItem().getElements()
            .forEach(function(pi){
                  pi.locked = false;
                  pi.remove();
            });      
              
            w_layer.isValid;
      }
}
//=================================================================================================================================================================
Document.prototype.fixAllTextFrames = function(){
      try {
      app.activeDocument.textFrames.everyItem().getElements()
      .filter(function(tf){
            return tf.itemLayer.name == 'erh_w_layer';
      })
      .forEach(function(tf){
            tf.fixPSTextVariables();
      });
      app.activeDocument.layers.itemByName('erh_w_layer').locked = true;
      }
      catch(e) {
            alert('fixAllTextFrames ' + e);
      }
}
//=================================================================================================================================================================
TextFrame.prototype.fixPSTextVariables = function(){
      try {
      var _this = this;
      var layer = app.activeDocument.layers.itemByName('erh_w_layer');
      if (!layer.isValid) return;
      
      if (_this.itemLayer != layer) return;
      
      _this.textVariableInstances.everyItem().getElements()
      .forEach(function(tvi){
            var   txtVar = tvi.associatedTextVariable,
                  txt = tvi.resultText
                        .replace(txtVar.variableOptions.textBefore,'')
                        .replace(txtVar.variableOptions.textAfter,'');
            if (!txt) return;
            
            var   paragraphForReplace = app.activeDocument.getERHTextByHash(app.activeDocument.textHash(txt));
            var   txtForReplace = app.activeDocument.textEdit(paragraphForReplace, true, true, true); //TEMPORARY triple true (for last correct use)
            var   completeText = ''.concat(
                        txtVar.variableOptions.textBefore, 
                        txtForReplace, 
                        txtVar.variableOptions.textAfter
                  ); 
            tvi.convertToText().contents = completeText;            
      }); 
      }
      catch(e) { 'fixPSTextVariables: ' + alert(e); }
}
//=================================================================================================================================================================
Document.prototype.textEdit = function textEdit(para, insertNumberingFlag, removeEndingPunctuationFlag, replaceNonJoinMarkersByLineBreaksFlag) {
      var txt = para.contents || '',
          bulletsAndNumbers = insertNumberingFlag ? para.bulletsAndNumberingResultText : '',  
          endingPunctuation = removeEndingPunctuationFlag ? /[@#~`.,:;]\s*$/g : /\u0000/g,
          insertLineBreaks = replaceNonJoinMarkersByLineBreaksFlag ? /\u200c/g : /\u0000/g; 
      var ret = ''.concat(
            bulletsAndNumbers, //вставить нумерацию параграфа
            txt
            .replace(/[\r\n]{1,}/g,' ') // баг замены принудительного переноса на новую строку пустым символом
            .replace(endingPunctuation,'') // снять концевую пунктуацию (знаки ! ? ... не снимаем)
            .replace(insertLineBreaks,'\n') // расставить разрывы строк в колонтитулах
          );   
      return ret;      
}
//=================================================================================================================================================================
TextFrame.prototype.tfHasPNMarkers = function() {
      if (this.parent instanceof MasterSpread) {
            var   ret =
                  this.characters.everyItem().contents
                  .atLeastOne(function(ch){
                        return ch == SpecialCharacters.AUTO_PAGE_NUMBER;
                  });
            return ret;
      }
      return false;
}
//=================================================================================================================================================================
TextFrame.prototype.tfHasRHMarkers = function(){
      if (this.parent instanceof MasterSpread) {
            var   ret = this.textVariableInstances.everyItem().associatedTextVariable
                  .map(function(tv){
                        return tv.variableType;
                  })
                  .atLeastOne(function(vt){
                        return vt == (VariableTypes.MATCH_PARAGRAPH_STYLE_TYPE ||
                                      VariableTypes.MATCH_CHARACTER_STYLE_TYPE);
                  });
                  return ret;
      }
      return false;
}
//=================================================================================================================================================================
Document.prototype.removeUnnecessaryTFs = function(){
      
      var   _this = this,
            selectedPages,
            w_layer = this.layers.itemByName('erh_w_layer'),
            smas;
      
      try {
            if (app.documents.length) {
                  smas = eval(app.activeDocument.extractLabel('smas'));
                  smas.toSource(); //to provoke an error status when the label has not been read. do not delete this line!
            }
      }
      catch (e) {
            smas = {sma_1: false, sma_2: false, sma_3: false, sma_4: false};
      }            
             
      for (var i = 1; i < 5; i++) {
            var condition = smas['sma_' + i];
            switch (i) {
                  case 1: //'Allow Running Headers To Be Placed On The Start Pages Of Sections' inverted:
                        if (condition) break; //INVERTED CONDITION
                        
                        w_layer.locked = false;
                        selectedPages = this.sections.everyItem().pageStart
                        .forEach(function(pg){ 
                              pg.textFrames.everyItem().getElements()
                              .forEach(function(tf){   
                                    /rh_c_\d+/g.test(tf.name) && tf.remove();
                              });
                        });
                        w_layer.locked = true;
                        break;
                        
                  case 2: //'Allow Page Numbers To Be Placed On The Last Pages Of Sections' inversed:
                        if (condition) break; //INVERTED CONDITION
                        w_layer.locked = false;
                        selectedPages = this.sections.everyItem().getElements()
                        .map(function(section){
                              var pgEnd = section.pageStart.documentOffset + section.length,
                                  retPg = _this.pages.item(pgEnd - 1);
                              if (retPg.isValid) return retPg;
                              else return undefined;
                        })
                        .forEach(function(pg){   
                              if (pg) {
                                    pg.textFrames.everyItem().getElements()
                                    .forEach(function(tf){
                                          /f_c_\d+/g.test(tf.name) && tf.remove();
                                    });
                              }
                        });
                        w_layer.locked = true;
                        break;
                        
                  case 3: //'Prohibit The Placement Of Running Headers And Page Numbers On Conditionally Blank Pages' normal:
                        //user have removed the main textFrame, OR
                        //this textFrame has no text (only whitespaces, linebreaks, newlines )
                        //The main textframe should not be on one of auxiliary layers.
                        //One should also check if the user has reduced the size of the main text frame
                        this.pages.everyItem().getElements()
                        .forEach(function(pg){
                              //if (_this.pageIsConditionallyBlank(pg)) {}
                        });
                        
                  
                        break;
                  case 4:
                        break;
            }
      }
}
//=================================================================================================================================================================
function ERH20213() {
      this.artifact = 'ERH20213';
      this.version = '2021.3';
      
      if (!(app.erh.hasOwnProperty('artifact'))) {
            app.erh['artifact'] = this.artifact;
            app.erh['version'] = this.version;
      }
}
//=================================================================================================================================================================
ERH20213.prototype.init = function(){
      app.erhDestructor();    // If the previous ID session ended abnormally
      app.erhConstructor();   // Build menu ($ID/Type)
}
//=================================================================================================================================================================
var   erh20213 = new ERH20213;
      erh20213.init();