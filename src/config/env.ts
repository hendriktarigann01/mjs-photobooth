export const env = {
  emailer: {
    user: process.env.NEXT_PUBLIC_EMAILER_USER as string,
    pass: process.env.NEXT_PUBLIC_EMAILER_PASS as string,
    host: process.env.NEXT_PUBLIC_EMAILER_HOST as string,
  },
  supabase: {
    url:
      (process.env.NEXT_PUBLIC_SUPABASE_URL as string) ||
      // "https://svtnrqfblasgxsijeyva.supabase.co",
      "https://ttiptxadahqgphyrabvh.supabase.co",
    key:
      (process.env.NEXT_PUBLIC_SUPABASE_KEY as string) ||
      // "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2dG5ycWZibGFzZ3hzaWpleXZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU5MTY1MTQsImV4cCI6MjA2MTQ5MjUxNH0.JSB1GDIF-kIsRYv9IUpAXdSvI_iePIkRykASE5W349c",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0aXB0eGFkYWhxZ3BoeXJhYnZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2MTMzMjIsImV4cCI6MjA5MTE4OTMyMn0.WPfXX9aodUrNhGhimnEU6aJ9s4Ryvf_8mG-AjiWCCxk",
  },
};
