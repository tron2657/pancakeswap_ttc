import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { FetchStatus } from 'config/constants/types'
import isEmpty from 'lodash/isEmpty'
import { pancakeBunniesAddress } from 'views/Nft/market/constants'
import { fetchPledgeList } from './helpers'
import { State } from './types'



const initialState: State = {
  data: {
    pledgeList: [],
    params: {
      sort: 0,
      is_user: 0,
      lp_type: 0,
      is_status: 1,
      coin_name: ''
    },
    initData: {}
  },
}

export const fetchPledgeListAsync = createAsyncThunk<
  any,
  { account: string; params: any }
>(
  'pledge/fetchPledgeListAsync',
  async ({ account, params }) => {
    const { sort,
      is_user,
      lp_type,
      is_status,
      coin_name } = params
    const response = await fetchPledgeList(account, sort, is_user, lp_type, is_status, coin_name)
    console.log('response plegeList1===', response)
    return response
  }
)
export const PlegeList = createSlice({
  name: 'PlegeList',
  initialState,
  reducers: {
    setPlegeList: (state, action: PayloadAction<any>) => {
      state.data.pledgeList = action.payload;
    },
    setPlegeListParams: (state, action: PayloadAction<any>) => {
      state.data.params = { ...state.data.params, ...action.payload };
      console.log('fetchPledgeListParams===', state.data.params)
    },
    setInitData: (state, action: PayloadAction<any>) => {
      state.data.pledgeList = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPledgeListAsync.pending, (state, action) => {
      console.log('fetchPledgeListAsync.pending===', action)
      // state.data.pledgeList = action.payload;
    })
    builder.addCase(fetchPledgeListAsync.fulfilled, (state, action) => {
      state.data.pledgeList = action.payload;
    })
  }

})

// Actions
export const {
  setPlegeList,
  setInitData,
  setPlegeListParams
} = PlegeList.actions

export default PlegeList.reducer
