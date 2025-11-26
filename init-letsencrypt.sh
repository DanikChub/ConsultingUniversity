#!/bin/sh

if [ -z "$1" ]; then
  echo "Usage: ./init-letsencrypt.sh email@example.com"
  exit 1
fi

domains=("xn--34-6kchqrlk8db.xn--p1ai" "xn----7sbhcmaqccmmwdch7bgljlbm.xn--p1ai")
email=$1
rsa_key_size=4096
staging=0 # set to 1 for testing to avoid rate limits

echo "### Starting nginx (for http challenge)..."
docker compose up -d nginx

echo "### Waiting 2s for nginx..."
sleep 2

echo "### Requesting Let's Encrypt certificates for: ${domains[*]}"

for domain in "${domains[@]}"; do
  echo "Requesting cert for $domain"
  if [ $staging = "1" ]; then staging_arg="--staging"; else staging_arg=""; fi

  docker run --rm -v "$(pwd)/certbot-etc:/etc/letsencrypt" \
    -v "$(pwd)/certbot-var:/var/lib/letsencrypt" \
    -v "$(pwd)/nginx/letsencrypt-webroot:/var/www/certbot" \
    certbot/certbot certonly --webroot \
      $staging_arg \
      --email "$email" --agree-tos --no-eff-email \
      -w /var/www/certbot -d "$domain"
done

echo "### Reloading nginx to pick up certs"
docker compose exec nginx nginx -s reload

echo "Done."
