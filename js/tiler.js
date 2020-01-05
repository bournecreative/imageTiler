(function () {

    var model = {
        images: []
    }

    var broker = {
        initData: function (data) {
            var payload = data.split("\n");
            payload.map(function (str, id) {
                const clean = str.replace(/\s+/g, '');
                const re = new RegExp(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\) \*\+,;=.]+$/);
                if (clean.match(re)) {
                    model.images.push({ id: id, img: clean })
                }
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
            var appTitle = document.createElement('h1'),
                appPurpose = document.createElement('p'),
                label = document.createElement('label'),
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
            label.setAttribute('for', 's7-urls');
            label.textContent = "Paste image URLs below";
            entryBtn.classList.add('btn-submit');
            entryBtn.textContent = "review imagery";
            entryBtn.addEventListener('click', function () {
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
            this.inputContainer.appendChild(label);
            this.inputContainer.appendChild(this.urlInput);
            this.inputContainer.appendChild(entryBtn);
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
            this.urlList = document.createElement('ul');
            // class assignment assignment
            listContainer.classList.add('t-list-container');
            this.urlList.classList.add('t-list');
            // Append elements to the DOM
            entryView.pageContainer.appendChild(listContainer);
            listContainer.appendChild(this.urlList)
            broker.initData(entryView.urlInput.value)
        },
        render: function () {
            const data = broker.retreiveData();
            if (!data) return
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