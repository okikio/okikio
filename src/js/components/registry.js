const Registry = {
    list: {},
    values(type) { 
        return Object.values(this.list[type]); 
    },
    
    create(type) {
        return Object.assign(this.list, {
            [type]: {}
        });
    },

    register(type, item = { name: "" }) {
        let { name, ...obj } = item;
        return Object.assign(this.list[type], {
            [name]: obj
        });
    },

    load(type, name) {
        return this.list[type][name];
    }
};

Registry.create("page-list");
Registry.create("transition-list");

export default Registry;
