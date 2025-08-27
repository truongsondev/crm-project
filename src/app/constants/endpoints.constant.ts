import { environment } from '@app/environments/environment.dev';

export const getEndpoints = () => {
  return {
    user: {
      v1: {
        users: `${environment.baseURL}/users`,
        create_user: `${environment.baseURL}/users`,
        update_user: `${environment.baseURL}/users/:id`,
        download_user: `${environment.baseURL}/users/download`,
        create_users: `${environment.baseURL}/multiple-user`,
      },
    },
    contact: {
      v1: {
        contacts: `${environment.baseURL}/contacts`,
        create_contact: `${environment.baseURL}/contacts`,
        update_contact: `${environment.baseURL}/contacts/:id`,
        delete_contact: `${environment.baseURL}/contacts/delete/:id`,
        download_contact: `${environment.baseURL}/contacts/download`,
        create_contacts: `${environment.baseURL}/multiple-contact`,
        delete_contacts: `${environment.baseURL}/delete/multiple-contact`,
        chart_contacts: `${environment.baseURL}/chart`,
      },
    },

    salesOrder: {
      v1: {
        salesOrder: `${environment.baseURL}/sales-order`,
        create_sale_order: `${environment.baseURL}/create-sales-order`,
        create_sales_order: `${environment.baseURL}/multiple-sales-order`,
        download_sale_order: `${environment.baseURL}/sale-order/download`,
        update_sale_order: `${environment.baseURL}/sale-order/:id`,
        delete_sale_order: `${environment.baseURL}/sale-order/delete/:id`,
        delete_sales_order: `${environment.baseURL}/delete/multiple-sales-order`,
      },
    },
    auth: {
      v1: {
        signIn: `${environment.baseURL}/auth/sign-in`,

        resetToken: `${environment.baseURL}/auth/reset-token`,
      },
    },
  } as const;
};
