const state = {
    modalShow: false,
    tokenValue: '',
    qrcode: '',
}

const getters = {
    modalShow: () => state.modalShow,
    tokenValue: () => state.tokenValue,
    qrcode: () => state.qrcode,
}

const actions = {
    changeModalShow({ commit }, { show, qrcode }) {
        commit("changeModalShow", { show, qrcode });
    },
    changeTokenValue({ commit }, { token }) {
        commit("changeTokenValue", { token });
    },
}

const mutations = {
    changeModalShow(state, { show, qrcode }) {
        state.modalShow = show
        if (qrcode) {
            state.qrcode = qrcode
        }
    },
    changeTokenValue(state, { token }) {
        state.tokenValue = token
    },
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};