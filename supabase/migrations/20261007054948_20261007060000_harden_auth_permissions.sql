/*
# Harden authentication and private-table permissions

1. Function security
- Restrict `public.handle_new_user()` so it cannot be called through the public REST API by anonymous or signed-in users.
- The function remains available to PostgreSQL's internal trigger execution because the trigger runs with the function owner context.

2. Private table access
- Remove direct table privileges from the `anon` role for `cart_items`, `order_items`, `orders`, `profiles`, and `wishlist_items`.
- Signed-in access remains governed by the existing owner-scoped RLS policies.

3. Data safety
- No tables, rows, columns, or user data are deleted or changed.
- Public catalog and newsletter behavior are unchanged.
*/

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM authenticated;

REVOKE ALL PRIVILEGES ON TABLE public.cart_items FROM anon;
REVOKE ALL PRIVILEGES ON TABLE public.order_items FROM anon;
REVOKE ALL PRIVILEGES ON TABLE public.orders FROM anon;
REVOKE ALL PRIVILEGES ON TABLE public.profiles FROM anon;
REVOKE ALL PRIVILEGES ON TABLE public.wishlist_items FROM anon;