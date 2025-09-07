import { environment } from '@app/environments/environment.dev';

export const getEndpoints = () => {
  return {
    user: {
      v1: {
        users: `${environment.baseURL}/users`,
        createUser: `${environment.baseURL}/users`,
        updateUser: `${environment.baseURL}/users`,
        downloadUser: `${environment.baseURL}/users/download`,
        createUsers: `${environment.baseURL}/multiple-user`,
      },
    },
    contact: {
      v1: {
        contacts: `${environment.baseURL}/contacts`,
        createContact: `${environment.baseURL}/contacts`,
        updateContact: `${environment.baseURL}/contacts`,
        deleteContact: `${environment.baseURL}/contacts/delete`,
        downloadContact: `${environment.baseURL}/contacts/download`,
        createContacts: `${environment.baseURL}/multiple-contact`,
        deleteContacts: `${environment.baseURL}/delete/multiple-contact`,
        chartContacts: `${environment.baseURL}/contact/chart`,
      },
    },

    salesOrder: {
      v1: {
        salesOrder: `${environment.baseURL}/sales-order`,
        createSalesOrder: `${environment.baseURL}/create-sales-order`,
        createSalesOrders: `${environment.baseURL}/multiple-sales-order`,
        downloadSalesOrders: `${environment.baseURL}/sale-order/download`,
        updateSaleOrder: `${environment.baseURL}/sale-order`,
        deleteSalesOrder: `${environment.baseURL}/sale-order/delete`,
        deleteSalesOrders: `${environment.baseURL}/delete/multiple-sales-order`,
        chartSalesOrders: `${environment.baseURL}/sales-orders/chart`,
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
