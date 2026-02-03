
$envFilePath = ".env"
Get-Content $envFilePath | ForEach-Object {
    if ($_ -match '^\s*([^#][^=]*)=(.*)$') {
        $name = $matches[1].Trim()
        $value = $matches[2].Trim()
        [System.Environment]::SetEnvironmentVariable($name, $value)
    }
}
$directUrl = [System.Environment]::GetEnvironmentVariable("DIRECT_URL")
psql $directUrl -c "COPY (select * from public.addresses order by addresses.id asc nulls last) TO STDOUT WITH CSV HEADER DELIMITER ',';" > .backup/addresses_rows.csv
psql $directUrl -c "COPY (select * from public.batches order by batches.id asc nulls last) TO STDOUT WITH CSV HEADER DELIMITER ',';" > .backup/batches_rows.csv
psql $directUrl -c "COPY (select * from public.customers order by customers.id asc nulls last) TO STDOUT WITH CSV HEADER DELIMITER ',';" > .backup/customers_rows.csv
psql $directUrl -c "COPY (select * from public.images order by images.id asc nulls last) TO STDOUT WITH CSV HEADER DELIMITER ',';" > .backup/images_rows.csv
psql $directUrl -c "COPY (select * from public.inventory_transactions order by inventory_transactions.id asc nulls last) TO STDOUT WITH CSV HEADER DELIMITER ',';" > .backup/inventory_transactions_rows.csv
psql $directUrl -c "COPY (select * from public.order_items order by order_items.id asc nulls last) TO STDOUT WITH CSV HEADER DELIMITER ',';" > .backup/order_items_rows.csv
psql $directUrl -c "COPY (select * from public.orders order by orders.id asc nulls last) TO STDOUT WITH CSV HEADER DELIMITER ',';" > .backup/orders_rows.csv
psql $directUrl -c "COPY (select * from public.products order by products.id asc nulls last) TO STDOUT WITH CSV HEADER DELIMITER ',';" > .backup/products_rows.csv
psql $directUrl -c "COPY (select * from public.purchase_order_items order by purchase_order_items.id asc nulls last) TO STDOUT WITH CSV HEADER DELIMITER ',';" > .backup/purchase_order_items_rows.csv
psql $directUrl -c "COPY (select * from public.purchase_orders order by purchase_orders.id asc nulls last) TO STDOUT WITH CSV HEADER DELIMITER ',';" > .backup/purchase_orders_rows.csv
psql $directUrl -c "COPY (select * from public.reviews order by reviews.id asc nulls last) TO STDOUT WITH CSV HEADER DELIMITER ',';" > .backup/reviews_rows.csv
psql $directUrl -c "COPY (select * from public.variants order by variants.id asc nulls last) TO STDOUT WITH CSV HEADER DELIMITER ',';" > .backup/variants_rows.csv
psql $directUrl -c "COPY (select * from public.vendors order by vendors.id asc nulls last) TO STDOUT WITH CSV HEADER DELIMITER ',';" > .backup/vendors_rows.csv