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
                var body = document.querySelector('body')
                body.classList.toggle('light')
            })
            // Append elements to the DOM
            document.querySelector('body').appendChild(this.pageContainer);
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

