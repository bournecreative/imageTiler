(function () {

    var model = {
        images: []
    }

    var broker = {
        cleanData: function (data) {
            var cleanInput = []
            var payload = data.split("\n");
            payload.map(function (str, id) {
                const clean = str.replace(/\s+/g, '');
                const re = new RegExp(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\) \*\+,;=.]+$/);
                if (clean.match(re)) {
                    cleanInput.push({ img: clean })
                }
            })
            broker.initData(cleanInput)
        },
        initData: function (data) {
            data.map(function (obj, id) {
                obj.id = id;
                obj.visible = true;
                model.images.push(obj);
            })
        },
        retreiveData: function () {
            return model.images;
        },
        updateVisibility(target) {
            targetData = model.images[target];
            if (targetData.visible === true) {
                targetData.visible = false
            } else {
                targetData.visible = true
            }
            imageTileView.render(target)
        },
        clearData: function () {
            model.images = [];
        }
    }

    var entryView = {
        init: function () {
            // creation of view elements
            this.pageContainer = document.createElement('div');
            this.inputContainer = document.createElement('div');
            this.urlInput = document.createElement('textarea');
            this.label = document.createElement('label');
            var appTitle = document.createElement('h1'),
                appPurpose = document.createElement('p'),
                entryBtn = document.createElement('button'),
                toggleContainer = document.createElement('div'),
                bgToggle = document.createElement('input'),
                lightLabel = document.createElement('label'),
                darkLabel = document.createElement('label');
            // class and attribute assignment
            this.pageContainer.classList.add('t-page-wrapper');
            this.inputContainer.classList.add('t-input-container');
            this.urlInput.setAttribute('id', 's7-urls');
            this.urlInput.setAttribute('placeholder', 'Enter s7 image info from Zeplin here!');
            toggleContainer.classList.add('t-bgColor-wrapper');
            bgToggle.setAttribute('type', 'checkbox');
            bgToggle.setAttribute('id', 'bgColor');
            lightLabel.setAttribute('for', 'bgColor');
            lightLabel.classList.add('t-bgColor-light');
            darkLabel.setAttribute('for', 'bgColor');
            darkLabel.classList.add('t-bgColor-dark');
            lightLabel.textContent = "light"
            darkLabel.textContent = "dark"
            appTitle.classList.add('t-app-title');
            appTitle.textContent = "Image Tiler";
            appPurpose.classList.add('t-purpose-desc');
            appPurpose.textContent = " 🕑 Quickly review CDN urls to ensure provided artwork 🎨 matches comps.";
            this.label.classList.add('t-highlight');
            this.label.setAttribute('for', 's7-urls');
            this.label.textContent = "Paste image URLs below";
            entryBtn.classList.add('btn-submit');
            entryBtn.textContent = "review imagery";
            entryBtn.addEventListener('click', function () {
                broker.cleanData(entryView.urlInput.value);
                if (broker.retreiveData().length < 1) {
                    entryView.entryError();
                    return
                }
                listView.init();
                listView.render();
                imageTileView.init();
                modalView.initModal();
            });
            bgToggle.addEventListener('click', function () {
                var body = setLaunch.tilerWindow.document.querySelector('body')
                body.classList.toggle('light')
            })
            // Append elements to the DOM
            setLaunch.tilerWindow.document.querySelector('body').appendChild(this.pageContainer);
            this.pageContainer.appendChild(this.inputContainer);
            this.inputContainer.appendChild(appTitle);
            this.inputContainer.appendChild(toggleContainer);
            toggleContainer.appendChild(darkLabel);
            toggleContainer.appendChild(bgToggle);
            toggleContainer.appendChild(lightLabel);
            this.inputContainer.appendChild(appPurpose);
            this.inputContainer.appendChild(this.label);
            this.inputContainer.appendChild(this.urlInput);
            this.inputContainer.appendChild(entryBtn);
        },
        entryError: function () {
            this.label.textContent = " Input entered rendered No valid image URLS!"
            this.label.classList.add('t-error')
        },
        remove: function () {
            entryView.inputContainer.remove();
        },
        reset: function () {
            entryView.pageContainer.remove();
            listView.listContainer.remove();
            imageTileView.tileContainer.remove();
            broker.clearData();
            entryView.init();
        }
    }

    var listView = {
        init: function () {
            // creation of view elements
            this.listContainer = document.createElement('div');
            var listInstruction = document.createElement('p');
            var urlCount = document.createElement('p');
            this.urlList = document.createElement('ul');
            // class assignment assignment
            this.listContainer.classList.add('t-list-container');
            listInstruction.classList.add('t-list-inst');
            listInstruction.innerHTML = `<strong>Instructions</strong> <br> <span class="one t-highlight">All valid URL strings have been parsed and are listed below.</span> <span class="two t-highlight">- Check the checkbox to hide an image.</span><span class="four t-highlight">-Tile selection will open a modal with larger image for better view</span> `;
            urlCount.innerHTML = "Returned " + "<span class='t-return'>" + broker.retreiveData().length + "</span>" + " Images";
            this.urlList.classList.add('t-list');
            // Append elements to the DOM
            entryView.pageContainer.appendChild(this.listContainer);
            this.listContainer.appendChild(listInstruction);
            this.listContainer.appendChild(urlCount);
            this.listContainer.appendChild(this.urlList);
        },
        render: function () {
            const data = broker.retreiveData();
            entryView.remove();
            data.map(function (img) {
                // creation of view elements
                var listItem = document.createElement('li');
                var listItemCheck = document.createElement('input');
                var listItemURL = document.createElement('input');
                // class and attribute assignment
                listItem.textContent = (img.id) + 1 + '.';
                listItem.classList.add('t-list-item', 't-highlight');
                listItem.setAttribute('data-id', img.id)
                listItemCheck.setAttribute('type', 'checkbox');
                listItemCheck.addEventListener('click', function (imgCopy) {
                    return function () {
                        broker.updateVisibility(imgCopy.id)
                    }
                }(img))
                listItemURL.setAttribute('type', 'text');
                listItemURL.value = img.img.toString();
                // List Item Append elements to the DOM
                listView.urlList.appendChild(listItem);
                listItem.appendChild(listItemCheck);
                listItem.appendChild(listItemURL);
            })
            // creation of view elements
            var resetBtn = document.createElement('button');
            // class and attribute assignment
            resetBtn.classList.add('t-reset');
            resetBtn.textContent = "reset";
            resetBtn.addEventListener('click', entryView.reset);
            // Append elements to the DOM
            listView.urlList.appendChild(resetBtn);
        }
    }

    var imageTileView = {
        init: function () {
            // creation of view elements
            this.tileContainer = document.createElement('div');
            var tileGrid = document.createElement('div');
            // class and attribute assignment
            this.tileContainer.classList.add('t-tile-container');
            tileGrid.classList.add('t-grid')
            // Append elements to the DOM
            entryView.pageContainer.appendChild(this.tileContainer);
            this.tileContainer.appendChild(tileGrid)
            const data = broker.retreiveData();
            data.map(function (item) {
                // creation of view elements
                var tile = document.createElement('div');
                var tileImg = document.createElement('img');
                // class and attribute assignment
                tile.classList.add('t-tile');
                tile.setAttribute('data-id', item.id);
                tileImg.setAttribute('src', item.img);
                tileImg.addEventListener('load', function () {
                    const imageHeight = this.clientHeight;
                    const spans = Math.ceil(imageHeight / 10 + 1);
                    this.parentNode.style.gridRowEnd = "span " + spans;
                })
                tileImg.addEventListener('click', modalView.renderModal)
                // Append elements to the DOM
                tileGrid.appendChild(tile)
                tile.appendChild(tileImg)
            })
        },
        render: function (target) {
            const targetTile = setLaunch.tilerWindow.document.querySelector('.t-tile[data-id="' + target + '"]')
            targetTile.classList.toggle('t-hide');
            if (targetTile.classList.contains('t-hide')) {
                setTimeout(function () {
                    targetTile.classList.add('t-remove')
                }, 200)
            } else {
                targetTile.classList.remove('t-remove')
            }
        }
    }
    var modalView = {
        initModal: function () {
            // creation of view elements
            this.body = setLaunch.tilerWindow.document.querySelector('body');
            this.modalShade = document.createElement('div');
            this.modalImage = document.createElement('img')
            // class and attribute assignment
            this.modalShade.classList.add('t-modal-shade');
            this.modalShade.addEventListener('click', modalView.closeModal)
            this.modalImage.classList.add('t-modal-image');
            // Append elements to the DOM
            this.body.appendChild(this.modalShade);
            this.modalShade.appendChild(this.modalImage);
        },
        renderModal: function () {
            const setImage = this.getAttribute('src')
            modalView.body.classList.add('modalOpen');
            modalView.modalImage.setAttribute('src', setImage)
            console.log(modalView.modalImage.clientHeight)
        },
        closeModal: function () {
            modalView.body.classList.remove('modalOpen');
        }
    }

    var setLaunch = {
        init: function () {
            this.tilerWindow = window.open("");
            setCSS.init()
        }
    }

    var setCSS = {
        init: function () {
            this.mysheet = document.createElement('style');
            this.mysheet.classList.add('tilercss');
            this.mysheet.innerHTML = '/*! normalize.css v8.0.1 | MIT License | github.com/necolas/normalize.css */html{line-height:1.15;-webkit-text-size-adjust:100%}body{margin:0}main{display:block}h1{font-size:2em;margin:.67em 0}hr{box-sizing:content-box;height:0;overflow:visible}pre{font-family:monospace,monospace;font-size:1em}a{background-color:transparent}abbr[title]{border-bottom:none;text-decoration:underline;text-decoration:underline dotted}b,strong{font-weight:bolder}code,kbd,samp{font-family:monospace,monospace;font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}img{border-style:none}button,input,optgroup,select,textarea{font-family:inherit;font-size:100%;line-height:1.15;margin:0}button,input{overflow:visible}button,select{text-transform:none}[type=button],[type=reset],[type=submit],button{-webkit-appearance:button}[type=button]::-moz-focus-inner,[type=reset]::-moz-focus-inner,[type=submit]::-moz-focus-inner,button::-moz-focus-inner{border-style:none;padding:0}[type=button]:-moz-focusring,[type=reset]:-moz-focusring,[type=submit]:-moz-focusring,button:-moz-focusring{outline:1px dotted ButtonText}fieldset{padding:.35em .75em .625em}legend{box-sizing:border-box;color:inherit;display:table;max-width:100%;padding:0;white-space:normal}progress{vertical-align:baseline}textarea{overflow:auto}[type=checkbox],[type=radio]{box-sizing:border-box;padding:0}[type=number]::-webkit-inner-spin-button,[type=number]::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}[type=search]::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}details{display:block}summary{display:list-item}template{display:none}[hidden]{display:none}body{background:#181818}body.light{background:#fff}.t-page-wrapper{position:relative;width:100%;height:100vh;box-sizing:border-box;padding:20px;font-family:Montserrat,sans-serif}.t-page-wrapper :focus{outline:#fff dashed 1px;outline-offset:3px}body.light .t-page-wrapper :focus{outline:#222 dashed 1px}.t-page-wrapper button{background-color:#e80a89;color:#fff;width:120px;border:none;margin-top:16px;transition:all .2s;font-size:14px;padding:10px 5px}.t-page-wrapper button:hover{background-color:#19a7b5;transform:scale(1.05)}.t-highlight{transition:all 1s ease;background:linear-gradient(to right,#e80a89 50%,#181818 50%);background-size:200% 100%;background-position:right bottom}body.light .t-highlight{transition:all 1s ease;background:linear-gradient(to right,#e80a89 50%,#fff 50%);background-size:200% 100%;background-position:right bottom}.t-input-container{display:flex;flex-direction:column;align-items:center}.t-app-title{margin-top:16px;margin-bottom:0;font-size:32px;color:#fff}body.light .t-app-title{color:#222}#bgColor{height:30px;width:70px;vertical-align:middle;background-color:#464646;border-radius:15px;cursor:pointer;-webkit-appearance:none;-moz-appearance:none;appearance:none}body.light #bgColor{background-color:#ccc}#bgColor[type=checkbox]:before{position:absolute;content:"";width:20px;height:20px;border-radius:50%;background:#e80a89;top:50%;left:50%;margin-top:-10px;margin-left:-10px;transform:translateX(-20px);transition:.7s}#bgColor[type=checkbox]:checked:before{position:absolute;content:"";width:20px;height:20px;border-radius:50%;background:#e80a89;top:50%;left:50%;margin-top:-10px;margin-left:-10px;transform:translateX(20px);transition:.7s}.t-bgColor-wrapper{position:absolute;top:0;right:0;color:#fff;padding:10px}.t-bgColor-light{margin-left:10px}.t-bgColor-dark{margin-right:10px}.t-input-container>label{font-size:14px;margin-bottom:12px;padding:7px;color:#fff}body.light .t-input-container>label{color:#222}.t-input-container label.t-error{background-position:left bottom;color:#fff}.t-purpose-desc{margin-bottom:12px;font-size:14px;color:#fff}body.light .t-purpose-desc{color:#222}.t-input-container textarea{width:400px;height:200px;resize:none;padding:10px;color:#fff;background:#222;border:1px solid #ccc;font-size:12px}body.light .t-input-container textarea{background:#fff;color:#222}.t-list-container{position:fixed;top:0;right:0;width:30%;height:100%;box-sizing:border-box;color:#fff;overflow-y:scroll}body.light .t-list-container{color:#222}.t-list-inst strong{font-size:32px}.t-list-inst{margin-top:0;margin-bottom:16px;font-size:14px}.t-list-inst span{display:block;line-height:1.7}.t-list-container .t-return{background:#e80a89;padding:0 4px}.t-list-inst span:hover{background-position:left bottom}.t-list{list-style-type:none;padding:0;margin:0}.t-list-item{display:flex;padding:4px 5px 4px 0;align-items:center;justify-content:flex-end}.t-list-item:hover,body.light .t-list-item:hover{background-position:left bottom}.t-list-item input[type=checkbox]{margin:0 3px}.t-list-item input[type=text]{width:90%}.t-tile-container{width:70%;box-sizing:border-box}.t-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));grid-gap:0 10px;grid-auto-rows:10px}.t-grid img{width:250px}.t-tile{opacity:.5;transition:ease .3s}.t-tile.t-hide{opacity:0}.t-remove{display:none}.t-tile.t-hide:hover{opacity:0}.t-tile:hover{opacity:1;transform:scale(1.05)}body .t-modal-shade{display:none}body.modalOpen .t-modal-shade{display:block;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(34,34,34,.6);z-index:10}.t-modal-image{display:block;position:relative;top:50%;transform:translateY(-50%);margin:0 auto;max-width:98%;max-height:90%}@media screen and (max-width:1450px){.t-list-container{width:40%}.t-tile-container{width:60%}}';
            this.render();
        },
        render: function () {
            setLaunch.tilerWindow.document.head.appendChild(this.mysheet);
            entryView.init()
        },
        remove: function () {
            this.cssTarget = document.querySelector('.tilercss');
            document.head.removeChild(this.cssTarget);
        }
    }
    setLaunch.init()
}())

