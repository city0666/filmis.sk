<!-- COOKIE -->
<link rel="stylesheet" type="text/css" href="//cdnjs.cloudflare.com/ajax/libs/cookieconsent2/3.0.3/cookieconsent.min.css" />
<script src="//cdnjs.cloudflare.com/ajax/libs/cookieconsent2/3.0.3/cookieconsent.min.js"></script>
<style>
    .cc-window a {
        color: #404040;
        text-decoration: underline;
    }
    .cc-dismiss {
        text-decoration: none !important;
    }
</style>

<script>
    window.addEventListener("load", function(){
        window.cookieconsent.initialise({
            "palette": {
                "popup": {
                    "background": "#efefef"

                },
                "button": {
                    "background": "#ff0000",
                    "text": "#ffffff"
                }
            },
			"theme": "classic",
            "position": "bottom-right",
            "content": {
                "message": "Naše webové stránky používajú cookies. Slúžia napríklad na účel analýzy návštevnosti tejto stránky alebo ďalšie vylepšovanie webu prostredníctvom anonymných štatistík a na účel personalizácie reklám. Prehliadaním webu vyjadrujete súhlas so <a href='pages/1/ochrana-osobnych-udajov-a-pouzivanie-cookies'> zásadami ochrany osobných údajov </a>.",
                "dismiss": "Rozumiem",
                "link": "",
                "href": ""
            }
        })});
</script>