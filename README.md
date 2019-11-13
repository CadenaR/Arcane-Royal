# Arcane-Royal

[Enlace a Trello](https://trello.com/invite/b/PfOO09JO/b86f813eaef5f1efb47f4e8dc26e1f74/juegos-en-red)

## Documento de diseño

#### Concepto general:
Juego multijugador en el que hasta cuatro magos luchan hasta que solo queda uno.

#### Género:
Multijugador, Battle Royale, Rol, Shooter en vista cenital.

#### Audiencia objetivo:
Todos los públicos, gente a la que le guste el género “battle royale”, los juegos de acción en 2D o incluso simplemente los juegos de multijugador competitivos.

#### Aspectos únicos:
Controles simplificados, aspecto agradable, partidas rápidas e intensas, multijugador en red.

#### Experiencia de juego:
El jugador toma el control de su avatar (El mago). Una vez todos los magos estén reunidos, participaran en distintas fases del torneo de hechizos. El jugador experimentará una experiencia de juego frenética y divertida, en la que las partidas sean breves e intensas, lo que hará que quiera seguir jugando “una ronda más”. Además, al jugar con amigos es mucho más entretenido ya que podrán interactuar de forma competitiva.

#### Estilo artístico: 
<img src="src/resources/Images/IMG_20191007_134016.jpg" width="400"> 

En esta primera pantalla encontraremos el logotipo del juego junto al cuadro de texto para introducir nuestro usuario. También podremos encontrar un botón de ayuda y un botón para iniciar la sesión.


<img src="src/resources/Images/IMG_20191007_134031.jpg" width="400">

La segunda pantalla representa lo que el jugador encontrará al iniciar la sesión. Esperará en una sala junto a otros jugadores. En la sala tendrá un botón para decir que está listo para jugar, a lo que una vez estén todos listos comenzará la partida tras una cuenta atrás. También puede encontrar un selector de estadísticas para personalizar su personaje.


<img src="src/resources/Images/IMG_20191007_134039.jpg" width="400">

Tras la pantalla de sala de espera se desarrollará la partida, en la que interactuamos con el mapa usando el ratón y podremos ver las distintas habilidades en la interfaz de usuario


<img src="src/resources/Images/IMG_20191007_134044.jpg" width="400">

Por último, al acabar las rondas correspondientes, se hará recuento de puntos y se pasará a la pantalla de puntuaciones mostrando un ranking de jugadores.

#### Mundo de ficción:
El jugador se encuentra en un torneo de hechizos, en el cual tendrá que superar a sus rivales en una gran batalla para determinar quién será el gran mago del mundo mágico.

#### Monetización:
Juego completamente gratuito.

#### Plataforma:
Juego orientado a navegador, preferiblemente desde un ordenador.

#### Funciones principales: 
Primero, el jugador encontrará una pantalla de inicio en la que deberá escribir su nombre de usuario. Los jugadores accederán a una sala multijugador en la cual se les asignará un equipo, y deberán indicar si están listos mediante un botón.

 Una vez todo el mundo esté listo y tras una cuenta atrás, empezará la partida y cada jugador aparecerá en una posición del campo de batalla y tendrán que recoger poderes para desbloquear sus habilidades, que usarán para eliminar a los demás jugadores y poder ganar. Una vez finalizada la ronda se le otorgará un punto al ganador. Al llegar a 10 rondas se hará recuento y el jugador con más puntos será el vencedor. Al acabar de hacer recuento podrán volver a empezar.

Dentro del juego existen 3 tipos de poderes: ofensivos, defensivos y aumento de estadísticas.

#### Objetivos: 
Durante la partida deberán moverse para buscar sus poderes y poder derrotar a los otros jugadores, quedando así solo uno, el ganador. Tras ganar una ronda, volverá a reiniciarse el campo de batalla, y así sucesivamente. Cuando un jugador obtenga 10 victorias, el juego acabará y se presentará una pantalla con el ranking de jugadores, y un botón para reiniciar el juego y volver a la pantalla de selección de nombre.

#### Sistemas de juego: 
El juego se ejecutará en el navegador, y principalmente se controlara con teclado y ratón.
En la pantalla de inicio el jugador deberá introducir su nombre con el teclado para saltar a la pantalla de matchmaking y entrar al lobby una vez ha encontrado partida. En la pantalla del lobby los jugadores deberán indicar si están listos mediante un botón, con el que se interactúa haciendo clic.

Dentro de la partida el jugador se moverá clicando hacia el punto al que desea desplazarse. Al hacer esto también se podrá interactuar con elementos del mapa. Para ejecutar las habilidades se usarán las teclas.

#### Interactividad:
La interactividad en Arcane Royal, gracias a sus controles simplificados y conocidos debido a que se basan en géneros muy popularizados como los MOBA , y su sistema de partidas cortas y por rondas, permite que el jugador tenga una experiencia de juego frenética y divertida, de manera que no se canse del juego y quiera seguir jugando.

#### Lista de posibles características adicionales: 
Las siguientes características son ideas que nos han surgido y que trataremos de incorporar al juego, sin embargo, somos conscientes de que debido a la naturaleza del proyecto, no contamos con todo el tiempo necesario para hacer un juego completo y es posible que muchas de estas características no puedan ser implementarlas.

#### Personalización de las estadísticas: 
Antes de entrar a la partida los jugadores podrán ver y personalizar sus estadísticas iniciales mediante una serie de puntos. Estas estadísticas luego podrán ir aumentando a lo largo de la partida mediante los aumentos de estadísticas. Esto permite un abanico más amplio de estilo de juego para los jugadores y les permite jugar de una forma u otra según su estilo.

#### Diferentes tipos de magias: 
Se podrían implementar 4 elementales para las magias (los típicos fuego, agua, tierra y hielo por ejemplo) y hacer que cada tipo tuviese una ventaja contra un tipo y una desventaja contra otro tipo, afectando tanto a los poderes ofensivos como a los defensivos.

Powerups a lo largo del mapa: Para darle más variedad a las partidas, una buena idea sería introducir distintos tipos de potenciadores que den vida (pociones) o den una ventaja temporal (posibilidad de moverse más rápido, hechizos más fuertes, capas de protección que bloqueen los ataques de los contrincantes...). También, en el caso de implementar los tipos de magias se podría introducir un ítem que te permitiera cambiar el elemento de tu magia. Todos estos objetos aparecen aleatoriamente cada cierto tiempo a lo largo del campo de batalla.

#### Modos de juego adicionales:
Enfrentamiento por equipos: El modo propuesto inicialmente es un modo todos contra todos, un deathmatch. Una buena idea sería agregar un modo distinto en el que se puedan enfrentar dos equipos de dos jugadores.

Hacer un segundo mapa que permita que jueguen más jugadores en la partida: Inicialmente, el juego se planteó como un juego para 4 jugadores pero posiblemente se podría hacer un mapa mayor al del modo principal e incluir la posibilidad de que jueguen más personas a la vez. Esto también se podría aplicar al modo por equipos haciendo que los equipos sean mayores o que haya más de dos equipos.

Modo gran torneo: Se podrían agregar torneos al juego basándose en el modo por equipos. En este modo, múltiples equipos se van enfrentando entre ellos a lo largo de varias rondas hasta que sólo queda un vencedor.

#### Fase 2: Desarrollo de juego en local

<img src="src/resources/Images/logoArcane.png">

<img src="src/resources/Images/sky2.jpg" width="500"> 

#### Escena de Menú principal

<img src="src/resources/Images/menu1.png" width="800">

###### Sprites obtenidos de https://opengameart.org

<img src="src/resources/Images/mago-azulupdown.png" width="500">

<img src="src/resources/Images/mago-azul.png" width="500">

<img src="src/resources/Images/mago-rojoupdown.png" width="500">

<img src="src/resources/Images/mago-rojo.png" width="500">

<img src="src/resources/Images/fireball.png" width="100">

<img src="src/resources/Images/barril2.png" width="100"> <img src="src/resources/Images/baseazul.png" width="100"> <img src="src/resources/Images/baseroja.png" width="100"> 

<img src="src/resources/Images/orbe1.png" width="100"> <img src="src/resources/Images/orbe2.png" width="100"> <img src="src/resources/Images/orbe3.png" width="100">

#### Escena de Juego

<img src="src/resources/Images/game1.png" width="800">

#### Desarrollo de la fase 2

Para la segunda fase del desarrollo del juego hemos priorizado las funcionalidades básicas, tales como la pantalla del juego y un menú de inicio.

Hemos desarrollado un mapa de juego, y hemos implementado las mecanicas basicas de la partida, asi como unicamente un modo de juego con dos personajes para la versión local. 

Actualmente el juego se compone de una pantalla de inicio con un botón Play, que nos lleva automaticamente a la pantalla de juego.

Hemos implementado un sistema de colisiones, para que el personaje no se mueva por zonas intransitables ni se salga del mapa. Tambien hemos desarrollado el sistema de powerups, con tres tipos diferentes (vida, daño y escudo), que se generan aleatoriamente. También hemos realizado un sistema de interacción entre los diferentes objetos del juego y personajes.

Como parte final, cabe destacar que principalmente queremos implementar los diferentes menús (pausa , opciones, controles, créditos etc..), sonidos, interfaz de juego para indicar información en partidas, nuevo mapa.

#### Integrantes:

Rodrigo Cadena Rodríguez \
Correo: r.cadenar.2019@alumnos.urjc.es \
Github: CadenaR

Nestor Hernandez Benito \
Correo: n.hernandezb.2017@alumnos.urjc.es \
Github: nesherbens

Álvaro Gonzalez Alcazar \
Correo: a.gonzaleza.2017@alumnos.urjc.es \
Github: AlvaroGA99

Alejandro Rodríguez Muñoz \
Correo: a.rodriguezmu.2017@alumnos.urjc.es \
Github: Rodron

