const state = {
    modalShow: false,
    tokenValue: '',
    qrcode: '',
    emailModalShow: false,
    phoneModalShow: false,
    verifyOldEmail: true,
    verifyOldPhone: true
}

const getters = {
    modalShow: () => state.modalShow,
    tokenValue: () => state.tokenValue,
    qrcode: () => state.qrcode,
    emailModalShow: () => state.emailModalShow,
    phoneModalShow: () => state.phoneModalShow,
    verifyOldEmail: () => state.verifyOldEmail,
    verifyOldPhone: () => state.verifyOldPhone
}

const actions = {
    changeModalShow({ commit }, { show, qrcode }) {
        commit("changeModalShow", { show, qrcode });
    },
    changeEmailModalShow({ commit }, { show }) {
        commit("changeEmailModalShow", { show })
    },
    changePhoneModalShow({ commit }, { show }) {
        commit('changePhoneModalShow', { show })
    },
    changeTokenValue({ commit }, { token }) {
        commit("changeTokenValue", { token });
    },
    changeVerifyOldEmail({ commit }, { verify }) {
        commit('changeVerifyOldEmail', { verify })
    },
    changeVerifyOldPhone({ commit }, { verify }) {
        commit('changeVerifyOldPhone', { verify })
    }
}

const mutations = {
    changeModalShow(state, { show, qrcode }) {
        state.modalShow = show
        if (qrcode) {
            state.qrcode = qrcode
        }
    },
    changeEmailModalShow(state, { show }) {
        state.emailModalShow = show
        console.log(state)
    },
    changePhoneModalShow(state, { show }) {
        state.phoneModalShow = show
    },
    changeTokenValue(state, { token }) {
        state.tokenValue = token
    },
    changeVerifyOldEmail(state, { verify }) {
        state.verifyOldEmail = verify
    },
    changeVerifyOldPhone(state, { verify }) {
        state.verifyOldPhone = verify
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};