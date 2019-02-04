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
                        v-validate="'required|alpha_dash'"
                        :error-messages="errors.collect('catalog.id')"
                        label="catalog id"
                        data-vv-name="id"
                        data-vv-scope="catalog"
                      />
                    </v-flex>
                    <v-flex sm6>
                      <v-text-field
                        v-model="editedItem.name"
                        v-validate="'required'"
                        :error-messages="errors.collect('catalog.name')"
                        label="Catalog name"
                        data-vv-name="name"
                        data-vv-scope="catalog"
                      />
                    </v-flex>
                    <v-flex sm6>
                      <v-text-field
                        v-model="editedItem.group"
                        v-validate="'required|alpha'"
                        :error-messages="errors.collect('catalog.group')"
                        label="Catalog group"
                        data-vv-name="group"
                        data-vv-scope="catalog"
                        prefix="group/"
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
            <td>{{ props.item.group.name }}</td>

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

const catalogueGroups = db.collection('groups');
const catalogues = db.collection('catalog');

export default {
    data() {
        return {
            pageTitle: 'Catalogs',
            catalogues: [],
            table: {
                headers: [
                    { text: 'ID', value: 'id' },
                    { text: 'Name', value: 'name' },
                    { text: 'Catalog Group', value: 'group.name' },
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
                group: ''
            },
            defaultItem: {
                id: '',
                name: '',
                group: ''
            }
        };
    },

    firestore: {
        catalogues
    },

    computed: {
        formTitle() {
            return this.editedIndex === -1 ? 'New Catalog' : 'Edit Catalog';
        }
    },

    created() {
        try {
            this.table.items = this.catalogues;
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
            this.editedIndex = this.catalogues.indexOf(item);
            this.editedItem = Object.assign({}, {
                id: item.id,
                name: item.name,
                group: item.group.id
            });

            this.table.dialog = true;
            this.errorMessage = '';
        },

        deleteItem(item) {
            const index = this.catalogues.indexOf(item);
            if (confirm('Are you sure you want to delete this item?')) {
                this.catalogues.splice(index, 1);
            }
        },

        validateForm() {
            this.$validator
                .validate('catalog.*')
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
                // this.catalogues.add({
                //     id: this.editedItem.id,
                //     text: this.editedItem.name,
                //     created: `catalog/${this.editedItem.catalog}`
                // });
            } else {
                const groupId = this.editedItem.group;
                const group = await catalogueGroups.doc(groupId).get();

                const catalogId = this.editedItem.id;
                const catalog = await catalogues.doc(catalogId).get();
                if (group.exists && !catalog.exists) {
                    catalogues.doc(catalogId).set({
                        name: this.editedItem.name,
                        group: group.ref
                    });
                    this.close();
                } else {
                    if (!group.exists) this.errorMessage = 'group not exist!';
                    if (catalog.exists) this.errorMessage = 'catalog with the same id exist!';
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
