# image Tiler

The image tiler will take a group of text, parse out the valid URLs, list out the urls and tile them in grid pattern for easy viewing.
![screen capture of list and tiled images](assets/image-tiler-grid.png width="400")


## Features

- Valid image urls are listed in a manner that allows user to see parsed URL string.
- Images corresponding to the valid image urls are tiled to the left of the list.
- User can hide tiled images by checking checkbox adjacent to the parsed URL.
- Modal opens with larger view of image when image tile is selected.
- Form reset

## Purpose

I wanted a way I could quickly view a group of images handed off to me in the form of CDN links. Sometimes the images provided are not valid and burn time trying to obtain after the handoff.

I also wanted to focus on writing code that separated concerns for better code organization. All views are managed independently with a simple controller that manages all the business logic between the modal and the views. The model is built dynamically from the submitted data that is successfully parsed.


### Directions

Form entry
![screen capture of form entry](assets/image-tiler-entry.png "input view" width="500")

If form is submitted with no information or the information submitted does not return any valid URLs, error field is displayed.
![screen capture of form entry with error](assets/image-tiler-error.png "input error" width="500")

Valid image url list is displayed on the right and corresponding images are tiled on the left of view.
![screen capture of list and tiled images](assets/image-tiler-grid.png "list and image tiles" width="500")

Checked images will fadeout from image tile grid. Unselecting the checkbox will display the imagery again.
![screen capture of hiding images](assets/hidden-image-tiler.png "checking off images" width="500")

Selecting an image from the image grid will open a modal with the image displayed in larger format.
![screen capture of image modal](assets/image-tiler-modal.png "modal" width="500")




