(function () {

    var model = {
        images: []
    }

    var broker = {
        initData: function (data) {
            var payload = data.split("\n")
            payload.map(function (str, id) {
                const clean = str.replace(/\s+/g, '')
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
            // entry element creation
            this.container = document.createElement('div');
            this.entryContainer = document.createElement('div'),
                this.textInput = document.createElement('textarea');
            var label = document.createElement('label'),
                entryBtn = document.createElement('button'),
                closeBtn = document.createElement('button');
            //
            this.container.classList.add('ir-container');
            this.entryContainer.classList.add('ir-entry');
            this.textInput.setAttribute('id', 's7-urls');
            label.setAttribute('for', 's7-urls');
            label.textContent = "Save Time 🕑 Quickly Review Artwork 🎨! Enter S7 URLs 🎉";
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
            //
            document.querySelector('body').appendChild(this.container);
            this.container.appendChild(this.entryContainer);
            this.container.appendChild(closeBtn);
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
            console.log("init is running")
            var listContainer = document.createElement('div');
            listContainer.classList.add('ir-list-container');
            this.urlList = document.createElement('ul');
            this.urlList.classList.add('ir-list');
            entryView.container.appendChild(listContainer);
            listContainer.appendChild(this.urlList)
            broker.initData(entryView.textInput.value)
        },
        render: function () {
            const data = broker.retreiveData();
            if (!data) return
            entryView.remove();
            data.map(function (img) {
                var listItem = document.createElement('li');
                listItem.classList.add('ir-list-item');
                var item = document.createElement('input');
                item.setAttribute('type', 'checkbox')
                var itemTitle = document.createElement('input');
                itemTitle.setAttribute('type', 'input');
                itemTitle.value = img.img.toString();
                listView.urlList.appendChild(listItem);
                listItem.appendChild(item);
                listItem.appendChild(itemTitle);
            })
            var updateBtn = document.createElement('button');
            updateBtn.classList.add('update-list');
            updateBtn.textContent = "Update Imgs";
            listView.urlList.appendChild(updateBtn);
        }
    }

    var imageTile = {
        init: function () {
            // image tile creation
            var tileContainer = document.createElement('div');
            var imageContainer = document.createElement('div');
            tileContainer.classList.add('ir-tile-container');
            imageContainer.classList.add('photo-wrapper')

            entryView.container.appendChild(tileContainer);
            tileContainer.appendChild(imageContainer)

            const data = broker.retreiveData();

            data.map(function (item) {
                var tile = document.createElement('div');
                tile.classList.add('photoGroup')
                imageContainer.appendChild(tile)
                var itemImg = document.createElement('img')
                itemImg.setAttribute('src', item.img)
                itemImg.addEventListener('load', function () {
                    const imageHeight = this.clientHeight;
                    const spans = Math.ceil(imageHeight / 10 + 1)
                    this.parentNode.style.gridRowEnd = "span " + spans;
                })
                tile.appendChild(itemImg)
            })
        }
    }
    entryView.init();
}())