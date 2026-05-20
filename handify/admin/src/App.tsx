import { Admin, Resource, ListGuesser, fetchUtils, AuthProvider, Layout, Menu } from 'react-admin';
import simpleRestProvider from 'ra-data-simple-rest';
import { useState } from 'react';
import { CategoryList } from './categories/CategoryList';
import { CategoryCreate } from './categories/CategoryCreate';
import { CategoryEdit } from './categories/CategoryEdit';
import { BookingList } from './bookings/BookingList';
import { BookingShow } from './bookings/BookingShow';
import { Dashboard } from './Dashboard';

// Store token in localStorage
const apiUrl = 'https://public-repo-j9sl.onrender.com/api';

const httpClient = (url: string, options: any = {}) => {
  if (!options.headers) {
    options.headers = new Headers({ Accept: 'application/json' });
  }
  const token = localStorage.getItem('admin_token');
  if (token) {
    options.headers.set('Authorization', `Bearer ${token}`);
    console.log('Sending request with token:', token.substring(0, 20) + '...');
  } else {
    console.log('No token found in localStorage');
  }
  console.log('Making request to:', url);
  return fetchUtils.fetchJson(url, options);
};

const dataProvider = simpleRestProvider(apiUrl, httpClient);

// Wrap the dataProvider to map _id <-> id for React Admin compatibility
const myDataProvider = {
  ...dataProvider,
  getList: async (resource: any, params: any) => {
    // Use the /admin endpoint for categories
    if (resource === 'categories') {
      const url = `${apiUrl}/${resource}/admin`;
      const result = await httpClient(url, { method: 'GET' });
      return {
        data: result.json.map((item: any) => ({ ...item, id: item._id })),
        total: result.json.length,
      };
    }
    // For services, fetch all without filter/range/sort
    if (resource === 'services') {
      const url = `${apiUrl}/services`;
      const result = await httpClient(url, { method: 'GET' });
      return {
        data: result.json.map((item: any) => ({ ...item, id: item._id })),
        total: result.json.length,
      };
    }
    // For bookings, fetch all without filter/range/sort
    if (resource === 'bookings') {
      const url = `${apiUrl}/bookings`;
      const result = await httpClient(url, { method: 'GET' });
      return {
        data: result.json.map((item: any) => ({ ...item, id: item._id })),
        total: result.json.length,
      };
    }
    const result = await dataProvider.getList(resource, params);
    return {
      ...result,
      data: (result.data ?? []).map((item: any) => ({ ...item, id: item._id || item.id })),
    };
  },
  getOne: async (resource: any, params: any) => {
    // For bookings, use admin endpoint
    if (resource === 'bookings') {
      const url = `${apiUrl}/bookings/admin/${params.id}`;
      const result = await httpClient(url, { method: 'GET' });
      return {
        data: { ...result.json, id: result.json._id },
      };
    }
    const result = await dataProvider.getOne(resource, params);
    return {
      ...result,
      data: { ...(result.data ?? {}), id: result.data?._id || result.data?.id },
    };
  },
  getMany: async (resource: any, params: any) => {
    const result = await dataProvider.getMany(resource, params);
    return {
      ...result,
      data: (result.data ?? []).map((item: any) => ({ ...item, id: item._id || item.id })),
    };
  },
  getManyReference: async (resource: any, params: any) => {
    const result = await dataProvider.getManyReference(resource, params);
    return {
      ...result,
      data: (result.data ?? []).map((item: any) => ({ ...item, id: item._id || item.id })),
    };
  },
  update: async (resource: any, params: any) => {
    // For bookings, use admin endpoint
    if (resource === 'bookings') {
      const { id, ...data } = params.data;
      const url = `${apiUrl}/bookings/admin/${id}`;
      const result = await httpClient(url, { 
        method: 'PATCH',
        body: JSON.stringify(data)
      });
      return {
        data: { ...result.json, id: result.json._id },
      };
    }
    // Remove id and use _id for update
    const { id, ...data } = params.data;
    const result = await dataProvider.update(resource, { ...params, data: { ...data, _id: id } });
    return {
      ...result,
      data: { ...(result.data ?? {}), id: result.data?._id || result.data?.id },
    };
  },
  updateMany: async (resource: any, params: any) => {
    const result = await dataProvider.updateMany(resource, params);
    return {
      ...result,
      data: (result.data ?? []).map((item: any) => ({ ...item, id: item._id || item.id })),
    };
  },
  create: async (resource: any, params: any) => {
    const result = await dataProvider.create(resource, params);
    return {
      ...result,
      data: { ...(result.data ?? {}), id: result.data?._id || result.data?.id },
    };
  },
  delete: async (resource: any, params: any) => {
    const result = await dataProvider.delete(resource, params);
    return {
      ...result,
      data: { ...(result.data ?? {}), id: result.data?._id || result.data?.id },
    };
  },
  deleteMany: async (resource: any, params: any) => {
    const result = await dataProvider.deleteMany(resource, params);
    return {
      ...result,
      data: (result.data ?? []).map((item: any) => ({ ...item, id: item._id || item.id })),
    };
  },
  // Custom methods for booking actions
  confirmBooking: async (id: string) => {
    const url = `${apiUrl}/bookings/admin/${id}/confirm`;
    const result = await httpClient(url, { method: 'PATCH' });
    return result.json;
  },
  cancelBooking: async (id: string) => {
    const url = `${apiUrl}/bookings/admin/${id}/cancel`;
    const result = await httpClient(url, { method: 'PATCH' });
    return result.json;
  },
};

const authProvider: AuthProvider = {
  login: async ({ username, password }) => {
    try {
      const request = new Request(`${apiUrl}/auth/login`, {
        method: 'POST',
        body: JSON.stringify({ email: username, password }),
        headers: new Headers({ 'Content-Type': 'application/json' }),
      });
      const response = await fetch(request);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }
      const data = await response.json();
      console.log('Login successful:', data);
      localStorage.setItem('admin_token', data.token);
      return Promise.resolve();
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  logout: () => {
    localStorage.removeItem('admin_token');
    return Promise.resolve();
  },
  checkAuth: () => {
    const token = localStorage.getItem('admin_token');
    console.log('Checking auth, token exists:', !!token);
    return token ? Promise.resolve() : Promise.reject();
  },
  checkError: (error) => {
    console.log('Auth error:', error);
    if (error.status === 401 || error.status === 403) {
      localStorage.removeItem('admin_token');
      return Promise.reject();
    }
    return Promise.resolve();
  },
  getPermissions: () => Promise.resolve(),
};

const CustomMenu = () => (
  <Menu>
    <Menu.DashboardItem />
    <Menu.ResourceItem name="categories" />
    <Menu.ResourceItem name="services" />
  </Menu>
);

const CustomLayout = (props: any) => <Layout {...props} menu={CustomMenu} />;

function App() {
  return (
    <Admin
      dataProvider={myDataProvider}
      authProvider={authProvider}
      dashboard={Dashboard}
      layout={CustomLayout}
    >
      <Resource
        name="categories"
        list={CategoryList}
        create={CategoryCreate}
        edit={CategoryEdit}
      />
      <Resource name="services" list={ListGuesser} />
      <Resource 
        name="bookings" 
        list={BookingList} 
        show={BookingShow}
      />
      <Resource name="notifications" list={ListGuesser} />
      <Resource name="chat/messages" list={ListGuesser} />
      <Resource name="requests" list={ListGuesser} />
      <Resource name="users" list={ListGuesser} />
    </Admin>
  );
}

export default App;
