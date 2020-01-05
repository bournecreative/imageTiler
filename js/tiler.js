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
            this.container = document.createElement('div');
            this.entryContainer = document.createElement('div');
            this.textInput = document.createElement('textarea');
            var appTitle = document.createElement('h1'),
                purpose = document.createElement('p'),
                label = document.createElement('label'),
                entryBtn = document.createElement('button'),
                closeBtn = document.createElement('button');
            // class and attribute assignment
            this.container.classList.add('ir-container');
            this.entryContainer.classList.add('ir-entry');
            this.textInput.setAttribute('id', 's7-urls');
            appTitle.classList.add('t-app-title')
            appTitle.textContent = "Image Tiler";
            purpose.classList.add('t-purpose-desc');
            purpose.textContent = " 🕑 Quickly review CDN urls to ensure provided artwork 🎨 matches comps.";
            label.setAttribute('for', 's7-urls');
            label.textContent = "Paste image URLs below";
            entryBtn.classList.add('btn-submit');
            entryBtn.textContent = "review imagery";
            entryBtn.addEventListener('click', function () {
                listView.init();
                listView.render();
                imageTile.init();
            });
            closeBtn.classList.add('close');
            closeBtn.textContent = "Close";
            closeBtn.addEventListener('click', entryView.closeWindow)
            // Append elements to the DOM
            document.querySelector('body').appendChild(this.container);
            this.container.appendChild(this.entryContainer);
            this.container.appendChild(closeBtn);
            this.entryContainer.appendChild(appTitle);
            this.entryContainer.appendChild(purpose);
            this.entryContainer.appendChild(label);
            this.entryContainer.appendChild(this.textInput);
            this.entryContainer.appendChild(entryBtn);
        },
        remove: function () {
            // entryView.entryContainer.classList.add('hide');
            entryView.entryContainer.remove();
        },
        closeWindow: function () {
            entryView.container.remove();
        }
    }

    var listView = {
        init: function () {
            // creation of view elements
            var listContainer = document.createElement('div');
            this.urlList = document.createElement('ul');
            // class assignment assignment
            listContainer.classList.add('ir-list-container');
            this.urlList.classList.add('ir-list');
            // Append elements to the DOM
            entryView.container.appendChild(listContainer);
            listContainer.appendChild(this.urlList)
            broker.initData(entryView.textInput.value)
        },
        render: function () {
            const data = broker.retreiveData();
            if (!data) return
            entryView.remove();
            data.map(function (img) {
                // creation of view elements
                var listItem = document.createElement('li');
                var item = document.createElement('input');
                var itemTitle = document.createElement('input');
                // class and attribute assignment
                listItem.classList.add('ir-list-item');
                item.setAttribute('type', 'checkbox')
                itemTitle.setAttribute('type', 'input');
                itemTitle.value = img.img.toString();
                // List Item Append elements to the DOM
                listView.urlList.appendChild(listItem);
                listItem.appendChild(item);
                listItem.appendChild(itemTitle);
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

    var imageTile = {
        init: function () {
            // creation of view elements
            var tileContainer = document.createElement('div');
            var imageContainer = document.createElement('div');
            // class and attribute assignment
            tileContainer.classList.add('ir-tile-container');
            imageContainer.classList.add('photo-wrapper')
            // Append elements to the DOM
            entryView.container.appendChild(tileContainer);
            tileContainer.appendChild(imageContainer)
            const data = broker.retreiveData();
            data.map(function (item) {
                // creation of view elements
                var tile = document.createElement('div');
                var itemImg = document.createElement('img')
                // class and attribute assignment
                tile.classList.add('photoGroup')
                itemImg.setAttribute('src', item.img)
                itemImg.addEventListener('load', function () {
                    const imageHeight = this.clientHeight;
                    const spans = Math.ceil(imageHeight / 10 + 1)
                    this.parentNode.style.gridRowEnd = "span " + spans;
                })
                // Append elements to the DOM
                imageContainer.appendChild(tile)
                tile.appendChild(itemImg)
            })
        }
    }
    entryView.init();
}())