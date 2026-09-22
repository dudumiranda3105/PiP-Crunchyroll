async page => {
 const svg = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 128 128\">\n  <rect x=\"4\" y=\"4\" width=\"120\" height=\"120\" rx=\"30\" fill=\"#17191d\"/>\n  <path d=\"M100 47C94 27 73 17 52 23C29 29 17 53 25 75C31 93 46 102 64 101C45 96 36 82 39 66C42 48 58 37 75 41C84 43 90 49 92 57C96 53 99 50 100 47Z\" fill=\"#ff640a\"/>\n  <path d=\"M86 54C80 44 66 43 57 50C47 58 46 72 54 81C59 87 67 89 74 87C65 84 62 76 65 69C68 62 77 60 84 65C87 61 88 57 86 54Z\" fill=\"#ff640a\"/>\n  <rect x=\"65\" y=\"71\" width=\"49\" height=\"36\" rx=\"8\" fill=\"#17191d\" stroke=\"#17191d\" stroke-width=\"9\"/>\n  <rect x=\"65\" y=\"71\" width=\"49\" height=\"36\" rx=\"8\" fill=\"#fff\"/>\n  <rect x=\"71\" y=\"77\" width=\"37\" height=\"24\" rx=\"3\" fill=\"#17191d\"/>\n  <rect x=\"87\" y=\"87\" width=\"17\" height=\"10\" rx=\"2\" fill=\"#ff640a\"/>\n</svg>\n";
 for (const size of [16, 32, 48, 128, 512]) {
   await page.setViewportSize({width:size,height:size});
   await page.setContent('<style>html,body{margin:0;background:transparent}svg{display:block;width:100vw;height:100vh}</style>'+svg);
   await page.locator('svg').screenshot({path:'icons/'+(size===512?'preview':'icon-'+size)+'.png',omitBackground:true});
 }
}
