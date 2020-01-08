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
            this.tileStyles = document.createElement('style');
            this.pageContainer = document.createElement('div');
            this.inputContainer = document.createElement('div');
            this.urlInput = document.createElement('textarea');
            this.label = document.createElement('label');
            var appTitle = document.createElement('h1'),
                appPurpose = document.createElement('p'),
                entryBtn = document.createElement('button'),
                closeBtn = document.createElement('button');
            // class and attribute assignment
            this.tileStyles.classList.add('tile-styles');
            this.tileStyles.setAttribute('ref', 'stylesheet');
            this.tileStyles.innerHTML = "body,html{margin:0}.t-container{margin-top:50px;padding:0 20px;width:100%;height:100%;z-index:20;font-family:Montserrat,sans-serif;box-sizing:border-box}.t-container :focus{outline:#000 dashed 1px;outline-offset:2px}.t-container textarea{width:40%;height:300px}.t-container button{background-color:#27290b;color:#fff;width:120px;height:40px;border:none;margin-top:16px;transition:all .2s}.t-container button:hover{background-color:#e4f042;color:#27290b;transform:scale(1.05)}.t-container button.close{position:fixed;background-color:#27290b;color:#fff;font-size:16px;font-weight:700;width:90px;height:30px;top:5px;right:-65px;margin:0;transition:right 1s;text-align:left;padding-left:20px;z-index:1}.t-container button.close:hover{background-color:#e4f042;color:#27290b;right:0}.t-input-container>label,button{display:block;margin-bottom:16px}.t-input-container>label{max-width:600px;transition:all 1s ease;background:linear-gradient(to right,#ee7575 50%,#fff 50%);background-size:200% 100%;background-position:right bottom;padding:7px 0}label.t-error{background-position:left bottom;color:#971a03}.t-list-container{position:fixed;top:0;right:0;width:30%;height:100%;box-sizing:border-box;overflow:scroll}.t-list-container .t-return{background:#e4f042;padding:0 4px}.t-list-inst strong{font-size:24px}.t-list-inst{margin-top:0;margin-bottom:16px;padding-left:10px;font-size:16px;line-height:1.5}.t-list-inst span{display:block;transition:all 1s ease;background:linear-gradient(to right,#e4f042 50%,#fff 50%);background-size:200% 100%;background-position:right bottom}.t-list-inst span.four:hover,.t-list-inst span.one:hover,.t-list-inst span.three:hover,.t-list-inst span.two:hover{background-position:left bottom}.t-list{font-size:12px;list-style-type:none;padding:0;margin:0}.t-list-item{display:flex;padding:4px 0;transition:all 1s ease;background:linear-gradient(to right,#e4f042 50%,#fff 50%);background-size:200% 100%;background-position:right bottom;align-items:center;line-height:1}.t-list-item:hover{background-position:left bottom}.t-list-item input[type=checkbox]{margin-right:5px}.t-list-item input[type=text]{width:90%}.t-list button:first-of-type{margin-right:16px}.t-list-container button{display:inline-block}.t-tile-container{width:70%;box-sizing:border-box}.t-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));grid-gap:0 10px;grid-auto-rows:10px}.t-grid img{width:250px}.t-tile{opacity:.5;transition:ease .3s}.t-tile.t-hide{opacity:0}.t-remove{display:none}.t-tile.t-hide:hover{opacity:0}.t-tile:hover{opacity:1;transform:scale(1.05)}body .t-modal-shade{display:none}body.modalOpen .t-modal-shade{display:block;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.75);z-index:1}.t-modal-image{display:block;position:relative;top:50%;transform:translateY(-50%);margin:0 auto;max-width:98%;max-height:90%}@media screen and (max-width:1450px){.t-list-container{width:40%}.t-tile-container{width:60%}}";
            this.pageContainer.classList.add('t-container');
            this.inputContainer.classList.add('t-input-container');
            this.urlInput.setAttribute('id', 's7-urls');
            appTitle.classList.add('t-app-title')
            appTitle.textContent = "Image Tiler";
            appPurpose.classList.add('t-purpose-desc');
            appPurpose.textContent = " 🕑 Quickly review CDN urls to ensure provided artwork 🎨 matches comps.";
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
            closeBtn.classList.add('close');
            closeBtn.textContent = "Close";
            closeBtn.addEventListener('click', entryView.closeWindow)
            // Append elements to the DOM
            document.head.appendChild(this.tileStyles);
            document.querySelector('body').appendChild(this.pageContainer);
            this.pageContainer.appendChild(this.inputContainer);
            this.pageContainer.appendChild(closeBtn);
            this.inputContainer.appendChild(appTitle);
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
        },
        closeWindow: function () {
            entryView.pageContainer.remove();
            entryView.tileStyles
            document.head.removeChild(entryView.tileStyles)
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
            listInstruction.innerHTML = `<strong>Instructions</strong> <br> <span class="one">All valid URL strings have been parsed and are listed below.</span> <span class="two">- Check the checkbox to hide an image.</span><span class="four">-Tile selection will open a modal with larger image for better view</span> `;
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
                listItem.classList.add('t-list-item');
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
            const targetTile = document.querySelector('.t-tile[data-id="' + target + '"]')
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
            this.body = document.querySelector('body');
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
    entryView.init();
}())

