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
                    cleanInput.push({ id: id, img: clean })
                }
            })
            broker.initData(cleanInput)
        },
        initData: function (data) {
            data.map(function (obj) {
                model.images.push(obj)
            })
        },
        retreiveData: function () {
            return model.images;
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
                closeBtn = document.createElement('button');
            // class and attribute assignment
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
            });
            closeBtn.classList.add('close');
            closeBtn.textContent = "Close";
            closeBtn.addEventListener('click', entryView.closeWindow)
            // Append elements to the DOM
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
            // entryView.inputContainer.classList.add('hide');
            entryView.inputContainer.remove();
        },
        closeWindow: function () {
            entryView.pageContainer.remove();
        }
    }

    var listView = {
        init: function () {
            // creation of view elements
            var listContainer = document.createElement('div');
            var listInstruction = document.createElement('p');
            this.urlList = document.createElement('ul');
            // class assignment assignment
            listContainer.classList.add('t-list-container');
            listInstruction.classList.add('t-list-inst');
            listInstruction.innerHTML = `<strong>Instructions</strong> <br> <span class="one">All valid URL strings have been parsed and are listed below.</span> <span class="two">- Check the checkbox to hide an image.</span> <span class="three">- See a typo that needs correction, update the value of the url string and select the 'Update Images' button.</span><span class="four">- Select an image tile to view a larger version of the imagery</span> `;
            this.urlList.classList.add('t-list');
            // Append elements to the DOM
            entryView.pageContainer.appendChild(listContainer);
            listContainer.appendChild(listInstruction);
            listContainer.appendChild(this.urlList);
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
                listItem.classList.add('t-list-item');
                listItemCheck.setAttribute('type', 'checkbox')
                listItemURL.setAttribute('type', 'input');
                listItemURL.value = img.img.toString();
                // List Item Append elements to the DOM
                listView.urlList.appendChild(listItem);
                listItem.appendChild(listItemCheck);
                listItem.appendChild(listItemURL);
            })
            // creation of view elements
            var updateBtn = document.createElement('button');
            // class and attribute assignment
            updateBtn.classList.add('update-list');
            updateBtn.textContent = "Update Imgs";
            // Append elements to the DOM
            listView.urlList.appendChild(updateBtn);
        }
    }

    var imageTileView = {
        init: function () {
            // creation of view elements
            var tileContainer = document.createElement('div');
            var tileGrid = document.createElement('div');
            // class and attribute assignment
            tileContainer.classList.add('t-tile-container');
            tileGrid.classList.add('t-grid')
            // Append elements to the DOM
            entryView.pageContainer.appendChild(tileContainer);
            tileContainer.appendChild(tileGrid)
            const data = broker.retreiveData();
            data.map(function (item) {
                // creation of view elements
                var tile = document.createElement('div');
                var tileImg = document.createElement('img')
                // class and attribute assignment
                tile.classList.add('t-tile')
                tileImg.setAttribute('src', item.img)
                tileImg.addEventListener('load', function () {
                    const imageHeight = this.clientHeight;
                    const spans = Math.ceil(imageHeight / 10 + 1)
                    this.parentNode.style.gridRowEnd = "span " + spans;
                })
                // Append elements to the DOM
                tileGrid.appendChild(tile)
                tile.appendChild(tileImg)
            })
        }
    }
    entryView.init();
}())