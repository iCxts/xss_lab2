docker build -t xss-lab2 .
docker run --rm -p 3000:3000 --name xss-lab2 xss-lab2
docker rm -f xss-lab2; docker build -t xss-lab2 . && docker run --rm -p 3000:3000 --name xss-lab2 xss-lab2



