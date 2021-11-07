# Pathfinding
Repository for hosting a HTML file containing A* pathfinding.

# How it works
You can change the state of a tile by clicking it.

After you created a start and a finish tile, you can press "Solve" and it shows you the (in most cases) fastest way from the start to the finish tile.

# Tile States
- After you click a tile once, it's color changes to black and is now a wall. Walls are objects the program can not go through.
- After you click a tile twice, it's color changes to green and is now the start. The start is where the program will begin.
- After you click a tile three times, it's color changes to red and is now the end. The end is where the program tries to find a way to.
- After you click a tile four times, it's color changes back to white and is now air. 
