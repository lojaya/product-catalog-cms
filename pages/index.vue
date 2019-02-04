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
          max-width="800px"
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
                    <v-flex sm12>
                      <v-text-field
                        v-model="editedItem.id"
                        v-validate="'required|alpha_dash'"
                        :error-messages="errors.collect('product.id')"
                        label="Product id"
                        data-vv-name="id"
                        data-vv-scope="product"
                      />
                    </v-flex>
                    <v-flex sm12>
                      <v-text-field
                        v-model="editedItem.name"
                        v-validate="'required'"
                        :error-messages="errors.collect('product.name')"
                        label="Product name"
                        data-vv-name="name"
                        data-vv-scope="product"
                      />
                    </v-flex>
                    <v-flex sm6>
                      <v-text-field
                        v-model="editedItem.price"
                        v-validate="'required|numeric'"
                        :error-messages="errors.collect('product.price')"
                        label="Price"
                        data-vv-name="price"
                        data-vv-scope="product"
                      />
                    </v-flex>
                    <v-flex sm6>
                      <v-text-field
                        v-model="editedItem.material"
                        v-validate="'required'"
                        :error-messages="errors.collect('product.material')"
                        label="Primary Material"
                        data-vv-name="material"
                        data-vv-scope="product"
                      />
                    </v-flex>
                    <v-flex sm6>
                      <v-select
                        v-model="editedItem.catalog"
                        v-validate="'required'"
                        :error-messages="errors.collect('product.catalog')"
                        :items="catalogs.map(
                          c => ({text: `${c.group.name} - ${c.name}`, value: c.id})
                        )"
                        solo
                        label="Catalog"
                        data-vv-name="catalog"
                        data-vv-scope="product"
                      />
                    </v-flex>
                    <v-flex sm6>
                      <v-select
                        v-model="editedItem.category"
                        v-validate="'required'"
                        :error-messages="errors.collect('product.category')"
                        :items="categories
                          .filter(v => v.catalog.id === editedItem.catalog)
                          .map(
                            c => ({text: c.name, value: c.id})
                          )"
                        solo
                        label="Category"
                        data-vv-name="category"
                        data-vv-scope="product"
                      />
                    </v-flex>
                    <v-flex md12>
                      <v-switch
                        v-model="editedItem.canTry"
                        :label="`Can Try? ${editedItem.canTry.toString()}`"
                        color="blue darken-3"
                      />
                    </v-flex>
                    <v-flex sm12>
                      <v-textarea
                        v-model="editedItem.detail"
                        v-validate="'required'"
                        :error-messages="errors.collect('product.detail')"
                        label="detail"
                        data-vv-name="detail"
                        data-vv-scope="product"
                      />
                    </v-flex>
                    <v-flex sm12>
                      <v-textarea
                        v-model="editedItem.sizeGuide"
                        v-validate="'required'"
                        :error-messages="errors.collect('product.sizeGuide')"
                        label="Size Guide"
                        data-vv-name="sizeGuide"
                        data-vv-scope="product"
                      />
                    </v-flex>

                    <v-flex sm12>
                      <template v-if="editedItem.images.length > 0">
                        <ul>
                          <li
                            v-for="(image, key) in editedItem.images"
                            :key="key"
                          >
                            <span
                              style="cursor: pointer"
                              @click="removeImage(image)"
                            >
                              x
                            </span>
                            {{ image }}
                          </li>
                        </ul>
                      </template>

                      <v-text-field
                        v-model="editedItem.newImage"
                        v-validate="'required|url'"
                        :error-messages="errors.collect('addimage.imgurl')"
                        label="Add Image"
                        data-vv-name="imgurl"
                        data-vv-scope="addimage"
                        @keyup.enter="addImage"
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
        expand
      >
        <template
          slot="items"
          slot-scope="props"
        >
          <tr
            v-if="!table.loading"
            style="cursor: pointer;"
            @click.stop="props.expanded = !props.expanded"
          >
            <td>{{ props.item.id }}</td>
            <td>{{ props.item.name }}</td>
            <td>{{ props.item.price }}</td>
            <td>{{ props.item.material }}</td>
            <td>{{ props.item.catalog.name }}</td>
            <td>{{ props.item.category.name }}</td>
            <td>{{ props.item.canTry }}</td>
            <!-- <td>
              <img
                :src="props.item.background"
                alt=""
                srcset=""
              >
            </td> -->

            <td class="justify-center layout px-0">
              <v-icon
                small
                class="mr-2"
                @click.stop="editItem(props.item)"
              >
                edit
              </v-icon>
              <v-icon
                small
                @click.stop="deleteItem(props.item)"
              >
                delete
              </v-icon>
            </td>
          </tr>
        </template>

        <template
          slot="expand"
          slot-scope="props"
        >
          <v-card flat>
            <v-card-text>
              <table class="table table-borderfull">
                <tr>
                  <td>Detail</td>
                  <td>{{ props.item.detail }}</td>
                </tr>
                <tr>
                  <td>Size Guide</td>
                  <td v-html="props.item.sizeGuide.replace(new RegExp('\n', 'g'), '<br>')" />
                  <!-- <td>{{ props.item.sizeGuide }}</td> -->
                </tr>
                <tr>
                  <td>Images</td>
                  <td>Images</td>
                </tr>
                <tr>
                  <td>Color</td>
                  <td>Color</td>
                </tr>
              </table>
            </v-card-text>
          </v-card>
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

const products = db.collection('products');
const catalogs = db.collection('catalog');
const categories = db.collection('category');

export default {
    data() {
        return {
            pageTitle: 'Products',
            products: [],
            table: {
                headers: [
                    { text: 'ID', value: 'id' },
                    { text: 'Name', value: 'name' },
                    { text: 'Price', value: 'price' },
                    { text: 'Material', value: 'material' },
                    { text: 'Catalog', value: 'catalog.name' },
                    { text: 'Category', value: 'category.name' },
                    { text: 'can Try?', value: 'canTry' },
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
                price: '',
                material: '',
                catalog: '',
                category: '',
                canTry: '',
                detail: '',
                images: '',
                sizeGuide: '',
                newImage: ''
            },
            defaultItem: {
                id: '',
                name: '',
                price: '',
                material: '',
                catalog: '',
                category: '',
                canTry: false,
                detail: '',
                images: [],
                sizeGuide: ''
            }
        };
    },

    firestore: {
        products,
        catalogs,
        categories
    },

    computed: {
        formTitle() {
            return this.editedIndex === -1 ? 'New Product' : 'Edit Product';
        }
    },

    async created() {
        this.table.loading = true;
        try {
            this.table.items = this.products;
        } catch (e) {
            this.table.items = [];
        }
        this.table.loading = false;
    },

    methods: {
        customFilter(items, search, filter) {
            search = search.toString().toLowerCase();
            return items.filter(i => (
                Object.keys(i).some(j => filter(i[j], search))
            ));
        },

        addImage(event) {
            this.$validator
                .validate('addimage.imgurl')
                .then(result => {
                    if (result) {
                        this.editedItem.images.push(event.target.value);
                    }
                })
                .catch(e => {
                    console.log(e);
                });
        },

        removeImage(image) {
            const index = this.editedItem.images.indexOf(image);
            this.editedItem.images.splice(index, 1);
        },

        async fetchCategories() {
            console.log('fetchCategories');
            this.$bind('categoriese', db.collection('category')).then(ctgr => {
                this.dialog.categories = ctgr.map(c => ({
                    text: c.name,
                    value: c.id
                }));
                console.log(this.dialog.categories);
            });
        },

        editItem(item) {
            this.editedIndex = this.products.indexOf(item);
            this.editedItem = Object.assign({}, {
                id: item.id,
                name: item.name,
                price: item.price,
                material: item.material,
                catalog: item.catalog.id,
                category: item.category.id,
                canTry: item.canTry,
                detail: item.detail,
                images: item.images,
                sizeGuide: item.sizeGuide
            });

            this.table.dialog = true;
            this.errorMessage = '';
        },

        deleteItem(item) {
            const index = this.products.indexOf(item);
            if (confirm('Are you sure you want to delete this item?')) {
                this.products.splice(index, 1);
            }
        },

        validateForm() {
            this.$validator
                .validate('product.*')
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
            try {
                const catalogId = this.editedItem.catalog;
                const catalog = await db.collection('catalog').doc(catalogId)
                    .get();

                const categoryId = this.editedItem.category;
                const category = await db.collection('category').doc(categoryId)
                    .get();

                const productId = this.editedItem.id;
                const product = await db.collection('products').doc(productId)
                    .get();

                if (!catalog.exists) {
                    this.errorMessage = 'catalog with this id not exist!';
                    return;
                }

                if (!category.exists) {
                    this.errorMessage = 'category with this id not exist!';
                    return;
                }

                // this.editedIndex < 0 &&
                if (product.exists) {
                    this.errorMessage = 'product with the same id exist!';
                    return;
                }

                await products.doc(productId).set({
                    name: this.editedItem.name,
                    price: this.editedItem.price,
                    material: this.editedItem.material,
                    catalog: catalog.ref,
                    category: category.ref,
                    canTry: this.editedItem.canTry,
                    detail: this.editedItem.detail,
                    images: this.editedItem.images,
                    sizeGuide: this.editedItem.sizeGuide
                    // created: new Date()
                });

                this.close();
            } catch (error) {
                console.log(error);
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
