<template>
  <div>
    <v-card class="elevation-1">
      <v-toolbar
        color="grey lighten-2"
        flat
        dense
      >
        <v-toolbar-title>
          <h5 class="text-uppercase">
            {{ pageTitle }}
          </h5>
        </v-toolbar-title>

        <v-spacer />

        <v-flex xs3>
          <v-text-field
            v-model="table.search"
            flat
            append-icon="search"
            label="Search"
            solo
            class="search-on-toolbar"
          />
        </v-flex>

        <v-dialog
          v-model="table.dialog"
          max-width="500px"
        >
          <v-btn
            slot="activator"
            color="primary"
            class="button-on-toolbar"
            @click="reset"
          >
            New Item
          </v-btn>
          <form
            lazy-validation
            @submit.prevent="validateForm"
          >
            <v-card>
              <v-card-title>
                <span class="headline">
                  {{ formTitle }}
                </span>
              </v-card-title>

              <v-card-text>
                <v-container grid-list-md>
                  <v-layout wrap>
                    <v-flex sm6>
                      <v-text-field
                        v-model="editedItem.id"
                        v-validate="'required|numeric|min_value:1'"
                        :error-messages="errors.collect('category.id')"
                        label="Category id"
                        data-vv-name="id"
                        data-vv-scope="category"
                      />
                    </v-flex>
                    <v-flex sm6>
                      <v-text-field
                        v-model="editedItem.name"
                        v-validate="'required'"
                        :error-messages="errors.collect('category.name')"
                        label="Category name"
                        data-vv-name="name"
                        data-vv-scope="category"
                      />
                    </v-flex>
                    <v-flex sm6>
                      <v-text-field
                        v-model="editedItem.catalog"
                        v-validate="'required|alpha'"
                        :error-messages="errors.collect('category.catalog')"
                        label="Category catalog"
                        data-vv-name="catalog"
                        data-vv-scope="category"
                        prefix="catalog/"
                      />
                    </v-flex>

                    <v-flex xs12>
                      <v-alert
                        :value="errorMessage"
                        type="error"
                      >
                        {{ errorMessage }}
                      </v-alert>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer />
                <v-btn
                  color="blue darken-1"
                  flat
                  @click="close"
                >
                  Cancel
                </v-btn>
                <v-btn
                  color="blue darken-1"
                  flat
                  @click="validateForm"
                >
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </form>
        </v-dialog>
      </v-toolbar>

      <v-data-table
        :loading="table.loading"
        :search="table.search"
        :headers="table.headers"
        :items="table.items"
        :custom-filter="customFilter"
        :rows-per-page-items="[25, 50, 100, 150, 200]"
        item-key="id"
      >
        <template
          slot="items"
          slot-scope="props"
        >
          <tr
            style="cursor: pointer;"
          >
            <td>{{ props.item.id }}</td>
            <td>{{ props.item.name }}</td>
            <td>{{ props.item.catalog.name }}</td>

            <td class="justify-center layout px-0">
              <v-icon
                small
                class="mr-2"
                @click="editItem(props.item)"
              >
                edit
              </v-icon>
              <v-icon
                small
                @click="deleteItem(props.item)"
              >
                delete
              </v-icon>
            </td>
          </tr>
        </template>

        <div
          slot="progress"
          class="d-block pt-5 pb-5 text-xs-center"
        >
          <v-progress-circular
            :size="70"
            :width="7"
            color="orange"
            indeterminate
          />
        </div>

        <template slot="no-results">
          <v-alert
            :value="true"
            color="error"
            icon="warning"
          >
            no data.
          </v-alert>
        </template>

        <template slot="no-data">
          <v-alert
            v-if="!table.loading"
            :value="true"
            color="error"
            icon="warning"
          >
            Sorry, nothing to display here :(
          </v-alert>
          <div v-else />
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
import { db } from '@/plugins/firebase';

const catalogues = db.collection('catalog');
const categories = db.collection('category');

export default {
    data() {
        return {
            pageTitle: 'Categories',
            categories: [],
            table: {
                headers: [
                    { text: 'ID', value: 'id' },
                    { text: 'Name', value: 'name' },
                    { text: 'Catalog', value: 'catalog.name' },
                    { text: 'Action', value: 'action' }
                ],
                items: [],
                pagination: {
                    sortBy: 'id',
                    descending: true
                },
                dialog: false,
                loading: false
            },

            editedIndex: -1,
            errorMessage: '',
            editedItem: {
                id: '',
                name: '',
                catalog: ''
            },
            defaultItem: {
                id: '',
                name: '',
                catalog: ''
            }
        };
    },

    firestore: {
        categories
    },

    computed: {
        formTitle() {
            return this.editedIndex === -1 ? 'New Category' : 'Edit Category';
        }
    },

    created() {
        try {
            this.table.items = this.categories;
        } catch (e) {
            this.table.items = [];
        }
    },

    methods: {
        customFilter(items, search, filter) {
            search = search.toString().toLowerCase();
            return items.filter(i => (
                Object.keys(i).some(j => filter(i[j], search))
            ));
        },

        editItem(item) {
            this.editedIndex = this.categories.indexOf(item);
            this.editedItem = Object.assign({}, {
                id: item.id,
                name: item.name,
                catalog: item.catalog.id
            });

            this.table.dialog = true;
            this.errorMessage = '';
        },

        deleteItem(item) {
            const index = this.categories.indexOf(item);
            if (confirm('Are you sure you want to delete this item?')) {
                this.categories.splice(index, 1);
            }
        },

        validateForm() {
            this.$validator
                .validate('category.*')
                .then(result => {
                    if (result) this.save();
                })
                .catch(e => {
                    console.log(e);
                });
        },

        reset() {
            this.$validator.reset();
            this.editedItem = Object.assign({}, this.defaultItem);
            this.editedIndex = -1;
            this.errorMessage = '';
        },

        close() {
            this.$validator.reset();
            this.table.dialog = false;
            setTimeout(() => {
                this.reset();
            }, 300);
        },

        async save() {
            console.log('savi');
            // if update
            if (this.editedIndex > -1) {
                // this.categories.add({
                //     id: this.editedItem.id,
                //     text: this.editedItem.name,
                //     created: `catalog/${this.editedItem.catalog}`
                // });
            } else {
                const categoryId = this.editedItem.id;
                const category = await categories.doc(categoryId).get();
                const catalogId = this.editedItem.catalog;
                const catalog = await catalogues.doc(catalogId).get();
                if (catalog.exists && !category.exists) {
                    categories.doc(categoryId).set({
                        name: this.editedItem.name,
                        catalog: catalog.ref
                    });
                    this.close();
                } else {
                    if (!catalog.exists) this.errorMessage = 'catalog not exist!';
                    if (category.exists) this.errorMessage = 'category with the same id exist!';
                }
            }
        }
    }
};
</script>

<style lang="css" scoped>
a:hover {
    text-decoration: none !important;
}
</style>
