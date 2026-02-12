package com.englishlearning.domain;

import java.util.Arrays;

public class Test {

    //输入int数组
    //输出int或者-1
    //123456789
    public static void main(String[] args) {
//        int[] array = {1,2,3,4,5,6,7,8,9,10};
//
//        int[] array1 = {2,4,6,8,10,12,14,16,18,20};
//
        int[] array3 = {2,4,6,8,10,12};
//
        Test test = new Test();
        int valueOfPercentTen = test.getValueOfPercentTen(array3);
        System.out.println(valueOfPercentTen);
    }


    public int getValueOfPercentTen(int[] values){
        if (values == null || values.length == 0){
            return -1;
        }

        Arrays.sort(values);
        int length = values.length;
        int indexOfPercentTen = -1;
        for (int i = 0; i < length; i++) {
            if (values[i] % length == 1){
                indexOfPercentTen = i;
                break;
            }
        }
        if (indexOfPercentTen < 0){
            return -1;
        }
        return values[indexOfPercentTen];
    }
}
