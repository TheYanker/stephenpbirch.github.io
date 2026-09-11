Drop project images and videos into the folder named after the project's slug,
then list them in the `media` array for that project in projects.js.

  media/flapping-wing-drone/
  media/ansys-fluid-simulation/
  media/steel-bear-canister/
  media/light-activated-food-dispenser/

Images: jpg/png/webp — roughly 1600px wide is plenty.
Video:  mp4 (H.264 + AAC) plays everywhere. Keep clips under ~20 MB, or put
        them on YouTube and use a { type: 'youtube', id: '...' } entry instead.
Anything listed but not present shows a "Media coming soon" placeholder.
