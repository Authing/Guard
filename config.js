const useCdn = process.argv.includes("--cdn");
const bucketDomain = useCdn ? "https://node2d-public.hep.com.cn/" : "/";
const distPath = useCdn ? "dist/" : "/";

const publicPath = useCdn ? `${bucketDomain}${distPath}` : `${distPath}`;

module.exports = {
  allCdnDomain: [
    bucketDomain,
    "https://cdn.authing.cn/",
    "https://usercontents.authing.cn/",
    "https://buckets.authing.cn/",
  ],
  useCdn,
  production: {
    publicPath,
    distPath,
    qiniu: {
      bucketDomain,
      accessKey: "fz_hnGR7k1CJg3gJX1rpSAWQve4fO7q2Ii7oUBxR",
      secretKey: "0SRnViDefQZVbQUkuYnvCBp_v_lIs7d3RYhPRNfN",
      zone: "Zone_z0", // 存储地区
      bucket: "node2d-public",
    },
  },
  transpileDependencies: ["vue-echarts", "resize-detector"],
};
