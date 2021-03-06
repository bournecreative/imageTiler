# image Tiler

The image tiler will take a group of text, parse out the valid URLs, list out the urls and tile them in grid pattern for easy viewing.
![screen capture of list and tiled images](assets/image-tiler-grid.png)


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
![screen capture of input view](assets/inputView1.png)

If form is submitted with no information or the information submitted does not return any valid URLs, error field is displayed.
![screen capture of input view with error](assets/errorMessage2.png)

Valid image url list is displayed on the right and corresponding images are tiled on the left of view.
![screen capture of list and tiled images](assets/responseView3.png)

Checked images will fadeout from image tile grid. Unselecting the checkbox will display the imagery again.
![screen capture of hiding images](assets/hiddenImages4.png)

Selecting an image from the image grid will open a modal with the image displayed in larger format.
![screen capture of modal](assets/modal5.png)





