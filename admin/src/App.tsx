import { Admin, Resource, fetchUtils, AuthProvider, Layout, Menu } from 'react-admin';
import simpleRestProvider from 'ra-data-simple-rest';
import { CategoryList } from './categories/CategoryList';
import { CategoryCreate } from './categories/CategoryCreate';
import { CategoryEdit } from './categories/CategoryEdit';
import { BookingList } from './bookings/BookingList';
import { BookingShow } from './bookings/BookingShow';
import { EmployeeList } from './employees/EmployeeList';
import { EmployeeEdit } from './employees/EmployeeEdit';
import { ServiceList } from './services/ServiceList';
import { ServiceCreate } from './services/ServiceCreate';
import { ServiceEdit } from './services/ServiceEdit';
import { SettingsList } from './settings/SettingsList';
import { SettingsEdit } from './settings/SettingsEdit';
import { TopupList } from './wallet/TopupList';
import { TopupEdit } from './wallet/TopupEdit';
import { Dashboard } from './Dashboard';

// Backend URL updated to Vercel
const apiUrl = 'https://handify-project.vercel.app/api';

const httpClient = (url: string, options: any = {}) => {
  if (!options.headers) {
    options.headers = new Headers({ Accept: 'application/json' });
  }
  const token = localStorage.getItem('admin_token');
  if (token) {
    options.headers.set('Authorization', `Bearer ${token}`);
  }
  return fetchUtils.fetchJson(url, options);
};

const baseProvider = simpleRestProvider(apiUrl, httpClient);

const myDataProvider: any = {
  ...baseProvider,
  getList: async (resource: string, params: any) => {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    const query = {
        sort: JSON.stringify([field, order]),
        range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
        filter: JSON.stringify(params.filter),
    };

    let url = `${apiUrl}/${resource}?${new URLSearchParams(query).toString()}`;
    if (resource === 'categories') {
      url = `${apiUrl}/categories/admin?${new URLSearchParams(query).toString()}`;
    } else if (resource === 'wallet') {
      url = `${apiUrl}/wallet/requests?${new URLSearchParams(query).toString()}`;
    }

    const { headers, json } = await httpClient(url);
    const data = json.data || json;

    return {
      data: data.map((record: any) => ({
        ...record,
        id: (record.id || record._id || '').toString()
      })),
      total: parseInt(headers.get('content-range')?.split('/').pop() || data.length.toString(), 10),
    };
  },

  getOne: async (resource: string, params: any) => {
    let url = `${apiUrl}/${resource}/${params.id}`;

    if (resource === 'wallet') {
      url = `${apiUrl}/wallet/requests/${params.id}`;
    } else if (resource === 'settings') {
      // Settings ko hamesha ID se fetch karein, key se nahi
      url = `${apiUrl}/settings/id/${params.id}`;
    }

    const { json } = await httpClient(url);
    const data = json.data || json;
    return {
      data: { ...data, id: (data.id || data._id || '').toString() },
    };
  },

  update: async (resource: string, params: any) => {
    let url = `${apiUrl}/${resource}/${params.id}`;

    if (resource === 'wallet') {
      url = `${apiUrl}/wallet/requests/${params.id}`;
      const { json } = await httpClient(url, {
        method: 'PATCH',
        body: JSON.stringify(params.data),
      });
      const data = json.data || json;
      return { data: { ...data, id: (data.id || data._id || '').toString() } };
    }

    const { json } = await httpClient(url, {
      method: 'PUT',
      body: JSON.stringify(params.data),
    });
    const data = json.data || json;
    return {
      data: { ...data, id: (data.id || data._id || '').toString() },
    };
  },

  create: async (resource: string, params: any) => {
    const url = `${apiUrl}/${resource}`;
    const { json } = await httpClient(url, {
      method: 'POST',
      body: JSON.stringify(params.data),
    });
    const data = json.data || json;
    return {
      data: { ...data, id: (data.id || data._id || '').toString() },
    };
  },

  getMany: async (resource: string, params: any) => {
    const query = {
        filter: JSON.stringify({ id: params.ids }),
    };
    const url = `${apiUrl}/${resource}?${new URLSearchParams(query).toString()}`;
    const { json } = await httpClient(url);
    const data = json.data || json;
    return {
      data: data.map((record: any) => ({
        ...record,
        id: (record.id || record._id || '').toString()
      })),
    };
  },
};

const authProvider: AuthProvider = {
  login: async ({ username, password }) => {
    const request = new Request(`${apiUrl}/auth/login`, {
        method: 'POST',
        body: JSON.stringify({ email: username, password }),
        headers: new Headers({ 'Content-Type': 'application/json' }),
    });
    const response = await fetch(request);
    if (!response.ok) throw new Error('Login failed');
    const data = await response.json();
    localStorage.setItem('admin_token', data.token);
    return Promise.resolve();
  },
  logout: () => {
    localStorage.removeItem('admin_token');
    return Promise.resolve();
  },
  checkAuth: () => localStorage.getItem('admin_token') ? Promise.resolve() : Promise.reject(),
  checkError: (error) => (error.status === 401 || error.status === 403) ? (localStorage.removeItem('admin_token'), Promise.reject()) : Promise.resolve(),
  getPermissions: () => Promise.resolve(),
};

const CustomMenu = () => (
  <Menu>
    <Menu.DashboardItem />
    <Menu.ResourceItem name="employees" />
    <Menu.ResourceItem name="bookings" />
    <Menu.ResourceItem name="categories" />
    <Menu.ResourceItem name="services" />
    <Menu.ResourceItem name="wallet" />
    <Menu.ResourceItem name="settings" />
  </Menu>
);

const CustomLayout = (props: any) => <Layout {...props} menu={CustomMenu} />;

function App() {
  return (
    <Admin
      dataProvider={myDataProvider as any}
      authProvider={authProvider}
      dashboard={Dashboard}
      layout={CustomLayout}
    >
      <Resource name="employees" list={EmployeeList} edit={EmployeeEdit} />
      <Resource name="categories" list={CategoryList} create={CategoryCreate} edit={CategoryEdit} />
      <Resource name="services" list={ServiceList} create={ServiceCreate} edit={ServiceEdit} />
      <Resource name="bookings" list={BookingList} show={BookingShow} />
      <Resource name="wallet" list={TopupList} edit={TopupEdit} options={{ label: 'Wallet Requests' }} />
      <Resource name="settings" list={SettingsList} edit={SettingsEdit} options={{ label: 'App Settings' }} />
    </Admin>
  );
}

export default App;
