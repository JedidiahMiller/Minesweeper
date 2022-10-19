
# Artifact from origional hard coded grid 
# This would be used to generate code for the grid
# which would just be copy pasted into the html


x = 20
y = 20

block = "<td></td>"


for i in range(y):
    print("<tr>")
    for i in range(x):
        print(block)
    print("</tr>")
    

